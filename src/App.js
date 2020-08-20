import React, {Component} from 'react';
import './App.css';
import { ReactComponent as Home } from "./images/buttonHomeWhite.svg";
import { ReactComponent as Remove } from "./images/buttonRemoveWhite.svg";
import RangeSelectorItem from './components/RangeSelectorItem/RangeSelectorItem';
import TimeSelectedItem from './components/TimeSelectedItem/TimeSelectedItem';
import DatePickerItem from './components/DatePickerItem/DatePickerItem';
import TimeLineItem from './components/TimeLineItem/TimeLineItem';
import SearchItem from './components/SearchItem/SearchItem';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import axios from 'axios';
import './api/userService';
import userService from './api/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

let cityCountryTimezone = require("city-country-timezone")

const today = new Date();
let startValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
let endValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0)
let range = [ new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0), 
                new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0)];

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            city:[   
                // {   Name:"Da Nang", 
                //     Timezone:"Asia/Ho_Chi_Minh", 
                //     TimeDiff: 7, 
                //     StartTime:new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()),
                //     EndTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), today.getSeconds()),
                //     isHome:true,
                // },                
            ],
            startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
            endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
            baseTimeDiff:0,
            buttonHomeClicked: false,
            address:"",
            showModalNewEvent: false,
            eventName:"New meeting",
            eventDescription:"",
            eventHostname:"",
            isLogin:true
        };   
        this.displayTime = this.displayTime.bind(this);
        this.onHomeClick = this.onHomeClick.bind(this);
        this.onRemoveClick = this.onRemoveClick.bind(this);
        this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
        this.onSelectSearchInput = this.onSelectSearchInput.bind(this);
        this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
        this.toggleNewEvent = this.toggleNewEvent.bind(this);
    }

    onDragStart = (e, index) => {
        this.draggedItem = this.state.city[index];
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.parentNode);
        e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
    };

    onDragOver = index => {
        const draggedOverItem = this.state.city[index];
        // if the item is dragged over itself, ignore
        if (this.draggedItem === draggedOverItem) {
            return;
        }   
        // filter out the currently dragged item
        let city = this.state.city.filter(item => item !== this.draggedItem);
        // add the dragged item after the dragged over item
        city.splice(index, 0, this.draggedItem);
        this.setState({ city });
    };

    onDragEnd = () => {
        this.draggedIdx = null;
    };

    /*** Display time in range selected */
    displayTime({ value }){
        // get value from range selected
        this.setState({startTime: value[0], endTime:value[1]});
        // get index of Home location
        let indexIsHome = -1;
        for (let i = 0; i < this.state.city.length; i++)
        {
            if (this.state.city[i].isHome)
            {
                indexIsHome = i;
            }
        }
        for (let i = 0; i < this.state.city.length; i++)
        {
            // if is Home location -> set time
            if (this.state.city[i].isHome)
            {
                this.setState(({city}) => (
                    {
                        city:[
                            ...city.slice(0, i),
                            {
                                ...city[i],
                                StartTime: this.state.startTime,
                                EndTime: this.state.endTime,
                            },
                            ...city.slice(i+1)
                        ]
                    }
                ))
            }
            // if not Home location -> calculate before set time
            else{ 
                const st = new Date(this.state.startTime);
                st.setHours(st.getHours() + this.state.city[i].TimeDiff - this.state.city[indexIsHome].TimeDiff);
                const et = new Date(this.state.endTime);
                et.setHours(et.getHours() + this.state.city[i].TimeDiff - this.state.city[indexIsHome].TimeDiff);
                this.setState(({city}) => (
                    {
                        city:[
                            ...city.slice(0, i),
                            {
                                ...city[i],
                                StartTime: st,
                                EndTime: et,
                            },
                            ...city.slice(i+1)
                        ]
                    }
                ))
            }
        }
    }

    /** Handle when user is typing in search input (google places api) */
    onChangeSearchInput = address => {
        this.setState({ address });
    };

    /** Handle when user select item in autocomplete place in search input (google places api) */
    onSelectSearchInput = address => {
        const cityName = address;
        // if input is null
        if (!cityName){
            return;
        }

        // if input is space
        const check = cityName.trim();
        if (!check){
            return;
        }

        const { timezone, time_diff } = cityCountryTimezone(String(cityName));            
        if (!timezone || !time_diff)
        {
            alert("Place not found");
            this.setState({
                address:''
            });
        }
        else{
            let checkIsHome = false;
            let date = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));
            let base = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
            let GMT = date.getTime() - base.getTime();
            GMT /= 1000*3600;
            GMT += 7;

            // first city -> set Home and base time different
            if (this.state.city.length === 0)
            {
                checkIsHome = true;
                this.setState({baseTimeDiff:GMT});
            }
            this.setState({
                address:'',
                city:[
                    ...this.state.city,
                    {   Name: cityName, 
                        Timezone: timezone, 
                        TimeDiff: GMT, 
                        StartTime:new Date(new Date().toLocaleString("en-US", {timeZone: timezone})),
                        EndTime: new Date(new Date().toLocaleString("en-US", {timeZone: timezone})),
                        isHome:checkIsHome
                    }
                ]
            });
            
        }      
    }

    /** Handle when user choose an item as Home location */
    onHomeClick(chosen){
        this.setState(({ city }) => (
            city.map((item, idx) => {
                item.Name !== chosen.Name?
                    item.isHome = false:
                    item.isHome = true
            })
        ));
        this.setState({ baseTimeDiff: chosen.TimeDiff, buttonHomeClicked:true})
    }

    /** Handle when user remove a location item */
    onRemoveClick(chosen){
        let { city } = this.state;
        const indexChosen = city.indexOf(chosen);
        if (city.length === 1)
        {
            this.setState({
                city:[
                    ...city.slice(0, indexChosen),
                    ...city.slice(indexChosen+1)
                ]})
        }
        else
        {
            // if Home location is delete -> let the first item is Home location
            city = [
                ...city.slice(0, indexChosen),
                ...city.slice(indexChosen+1)
            ]
            if (this.state.city.length > 0 && chosen.isHome===true)
            {
                city = [
                    {
                        ...city[0],
                        isHome:true,                            
                    },
                    ...city.slice(1)
                ]
                this.setState({
                    city: city,
                    baseTimeDiff:city[0].TimeDiff,
                    
                })
            }
        }

    }

    /** Handle when user change date */
    onChangeDatePicker = (date) =>{
        startValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
        endValue = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 24, 0, 0)
        range = [ new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0), 
                        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0, 0)];
        let {city} = this.state;
        for (let i = 0; i < city.length; i++)
        {
            city[i].StartTime = date;
            city[i].EndTime = date;
        }
        this.setState({
            startTime:date,
            endTime:date,
            city: city
        });
    }

    /** Look for localStorage and update state city if possible */
    componentWillMount(){
        // localStorage.setItem('email','pvkhai98dn@gmail.com');
        // localStorage.setItem('user',JSON.stringify({token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyNTJlNzNmOC1jZDc0LTQ2MWQtOTZiYy1iM2Y1YmRlYWFiNDEiLCJpYXQiOjE1OTc3NTE5MjAsImV4cCI6MTU5ODM1NjcyMH0.tAP8EabYNCNlJNIB9LIGghJHbRX_uUZmlgHHjaPD07o"}))
        if (localStorage.getItem('email') !== null && localStorage.getItem('user') !== null)
        {
            this.setState({isLogin:true})
        }
        else
        {
            this.setState({isLogin:false})
        }
        if (localStorage.getItem('city') !== null)
        {
            let city = JSON.parse(localStorage.getItem('city'));
            let indexIsHome = -1;
            for (let i = 0; i < city.length; i++)
            {
                // keep time range selected -> use StartTime and EndTime
                // city[i].StartTime = new Date(city[i].StartTime);
                // city[i].EndTime = new Date(city[i].EndTime);

                // do not keep time range selected
                city[i].StartTime = new Date(new Date().toLocaleString("en-US", {timeZone: city[i].Timezone}))
                city[i].EndTime = new Date(new Date().toLocaleString("en-US", {timeZone: city[i].Timezone}))
                if (city[i].isHome === true)
                    indexIsHome = i;
            }
            this.setState({
                city: city,
                baseTimeDiff: (indexIsHome !== -1)?city[indexIsHome].TimeDiff:0
            });
        }
        else{
            return;
        }
    }

    /** Update localStorage */
    componentWillUpdate(nextProps, nextState){
        localStorage.setItem('city', JSON.stringify(nextState.city));
    }

    onSubmitGetEvent = (event) => {
        event.preventDefault();
        let data = userService.getEventList();
        // console.log("list: ",data);
    }

    /** Change visibility of Modal new event */
    toggleNewEvent = () => {
        this.setState({showModalNewEvent: !this.state.showModalNewEvent});
    }

    /** Handle when submit new event */
    onSubmitAddEvent = (event) => {
        event.preventDefault();
        let indexIsHome = -1;
        let subcities = []
        for (let i = 0; i < this.state.city.length; i++)
        {
            if (this.state.city[i].isHome)
            {
                indexIsHome = i;
            }
            else
            {
                subcities = [
                    ...subcities,
                    {
                        name: this.state.city[i].Name,
                        timezone: this.state.city[i].Timezone
                    }
                ]
            }
        }
        const addEvent = {
            eventname: this.state.eventName,
            basetimezone:this.state.city[indexIsHome].Timezone,
            baselocation:this.state.city[indexIsHome].Name,
            timestart:this.state.city[indexIsHome].StartTime,
            timeend:this.state.city[indexIsHome].EndTime,
            description: this.state.eventDescription,
            hostname: this.state.eventHostname,
            subcities: subcities
        }

        userService.createEvent(addEvent);
        NotificationManager.success('Create event successfully');
        this.toggleNewEvent();
    }

    /** Handle when user type event name */
    onChangeEventName = (event) => {
        this.setState({eventName: event.target.value});
    }

    /** Handle when user type event description */
    onChangeEventDescription = (event) => {
        this.setState({eventDescription: event.target.value});
    }

    /** Handle when user type host name */
    onChangeEventHostname = (event) => {
        this.setState({eventHostname: event.target.value});
    }

    render() {
        return (
            <div className="App">                
                <div className="Header">
                    <SearchItem 
                        address={this.state.address} 
                        handleChange={this.onChangeSearchInput} 
                        handleSelect={this.onSelectSearchInput}
                    /> 
                    <DatePickerItem 
                        onChange={this.onChangeDatePicker} 
                        startTime={this.state.startTime} 
                    /> 
                    <Button color="primary" className="buttonNewEvent" onClick={this.toggleNewEvent} style={{display: this.state.isLogin?"block":"none"}}>Save event</Button> 
                    <Modal isOpen={this.state.showModalNewEvent} toggle={this.toggleNewEvent} className="modalNewEvent">
                        <ModalHeader toggle={this.toggleNewEvent}>Create new event</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="exampleText">Event name</Label>
                                <Input type="text" name="eventName" placeholder="Event name" defaultValue="New meeting"
                                    onChange={this.onChangeEventName}></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Event description</Label>
                                <Input type="text" name="eventDescription" placeholder="Event description"
                                    onChange={this.onChangeEventDescription}></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Host name</Label>
                                <Input type="text" name="eventHostname" placeholder="Host name" 
                                    onChange={this.onChangeEventHostname}></Input>
                            </FormGroup>
                            {
                                this.state.city.length > 0 && this.state.city.map((item) => 
                                (   item.isHome===true?
                                        <FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText">Host location</Label>
                                                <Input type="text" id="eventHostLocation" placeholder="Host location" value={item.Name} disabled></Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText">Host timezone</Label>
                                                <Input type="text" id="eventHostTimeZone" placeholder="Host location" value={item.Timezone} disabled></Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText">Start Time</Label>
                                                <Input type="text" id="eventTimeStart" value={item.StartTime} disabled></Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleText">End Time</Label>
                                                <Input type="text" id="eventTimeEnd" value={item.EndTime} disabled></Input>
                                            </FormGroup>
                                        </FormGroup>
                                    :null
                                ))
                            }
                            <ListGroup>
                                <Label for="exampleText">Invited location</Label>
                                {
                                    this.state.city.length > 0 && this.state.city.map((item) => 
                                    (   item.isHome!==true?
                                            <ListGroupItem disabled>{item.Name}</ListGroupItem>
                                        :null
                                    ))
                                }
                            </ListGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit" onClick={this.onSubmitAddEvent}>Save</Button>                    
                            <Button color="secondary" onClick={this.toggleNewEvent}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <main className="main"> 
                    <div className="background-timeline">
                        <ul>
                            {this.state.city.length > 0 && this.state.city.map((item, idx) => (
                                <li key={item.name} onDragOver = {() => this.onDragOver(idx)}>
                                    <div 
                                        className="drag"  
                                        onDragStart={e => this.onDragStart(e, idx)}
                                        onDragEnd={this.onDragEnd}
                                    >
                                        <div className="home-remove">
                                            <Home onClick={() => this.onHomeClick(item)}/>
                                            <Remove onClick={() => this.onRemoveClick(item)}/>
                                        </div>
                                        <div className="clock-data" draggable>
                                            <TimeSelectedItem item={item}/>
                                        </div>
                                    </div>                                    
                                    <div className= "content">
                                        <TimeLineItem idx={idx} item={item} baseTimeDiff={this.state.baseTimeDiff} buttonHomeClicked={this.state.buttonHomeClicked}></TimeLineItem>                              
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="timeline-selector">
                        <RangeSelectorItem 
                            range={range} 
                            startValue={startValue}
                            endValue={endValue}
                            numberCity={this.state.city.length} 
                            displayTime = {this.displayTime}
                        />   
                    </div>          
                </main>   
                <NotificationContainer/>           
            </div>
        );
    }    
}

export default App;
