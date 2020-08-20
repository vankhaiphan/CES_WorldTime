import React, { Component } from "react";
import EventItem from "../EventItems/EventItem";
import { Table, Button, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import userService from '../../api/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import '../../App.css';
import './ListEvents.css';
import SearchItem from '../SearchItem/SearchItem';
import DatePickerItem from '../DatePickerItem/DatePickerItem';
import { ReactComponent as Home } from '../../images/buttonHomeWhite.svg';
import { ReactComponent as Remove } from "../../images/buttonRemoveWhite.svg";
import RangeSelectorItem from '../RangeSelectorItem/RangeSelectorItem';
import TimeSelectedItem from '../TimeSelectedItem/TimeSelectedItem';
import TimeLineItem from '../TimeLineItem/TimeLineItem';

let cityCountryTimezone = require("city-country-timezone")

let today = new Date();
let startValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
let endValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0)
let range = [ new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0), 
                new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0)];


class ListEvents extends Component {
	// state = {
	// 	data : [
	// 	],
	// }
	constructor(props){
		super(props);
		this.state = {
			data : [
			],

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
            eventName:"",
            eventDescription:"",
			eventHostname:"",
			eventIdChosen:{},
			showModalEditEvent: false,
		};
		this.onSubmitGetEvent();
		this.deleteEvent = this.deleteEvent.bind(this);
		this.editEvent = this.editEvent.bind(this);
		this.toggleEditEvent = this.toggleEditEvent.bind(this);
		this.onChangeSearchInput = this.onChangeSearchInput.bind(this);
		this.onSelectSearchInput = this.onSelectSearchInput.bind(this);
		this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
		this.onHomeClick = this.onHomeClick.bind(this);
		this.onRemoveClick = this.onRemoveClick.bind(this);
		this.displayTime = this.displayTime.bind(this);
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
            // alert("Place not found");
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
        else if (this.state.city.length > 1)
        {
            // if Home location is delete -> let the first item is Home location
            city = [
                ...city.slice(0, indexChosen),
                ...city.slice(indexChosen+1)
            ]
            if (chosen.isHome===true)
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
            else{
                this.setState({
                    city: city
                })
            }
        }

    }

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

	onSubmitGetEvent = async () => {
		let dataReceive = await userService.getEventList();
		this.setState({data: dataReceive})
	}
	
	deleteEvent = (eventid) => {
		return async(event) => {
			let dataReceive = await userService.deleteEvent(eventid);
			setTimeout(() => {
				this.onSubmitGetEvent();
			},500)
			NotificationManager.success('Delete event successfully');
		}
		
	}

	toggleEditEvent = () => {
		this.setState({showModalEditEvent: !this.state.showModalEditEvent});
		// if (this.state.showModalEditEvent === true)
		// 	this.setState({city:[]})
	}

	removeCity = () => {
		this.setState({city:[]});
		this.toggleEditEvent();
	}

	saveEdit = (event) => {
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
			eventid: this.state.eventIdChosen.eventid,
            eventname: this.state.eventName?this.state.eventName:"",
            basetimezone:this.state.city[indexIsHome].Timezone,
            baselocation:this.state.city[indexIsHome].Name,
            timestart:this.state.city[indexIsHome].StartTime,
            timeend:this.state.city[indexIsHome].EndTime,
            description: this.state.eventDescription?this.state.eventDescription:"",
            hostname: this.state.eventHostname?this.state.eventHostname:"",
            subcities: subcities
		}
		
		userService.editEvent(addEvent);
		setTimeout(() => {
			this.onSubmitGetEvent();
		},500)
		this.toggleEditEvent();
		NotificationManager.success('Edit event successfully');

	}

	editEvent = (item) => {
		return (event) => {
			this.setState({eventIdChosen:item,
				eventName:item.eventname,
				eventDescription:item.description,
				eventHostname: item.hostname})
			let checkIsHome = false;
			let date = new Date(new Date().toLocaleString("en-US", {timeZone: item.basetimezone}));
            let base = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
            let GMT = date.getTime() - base.getTime();
            GMT /= 1000*3600;
			GMT += 7;
			let city = []
			// first city -> set Home and base time different
            if (city.length === 0)
            {
                checkIsHome = true;
				this.setState({baseTimeDiff:GMT});
				today = new Date(item.timestart);
				startValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
				endValue = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 24, 0, 0)
				range = [new Date(item.timestart), new Date(item.timeend)]
            }
            city = [
				...city,
				{   Name: item.baselocation, 
					Timezone: item.basetimezone, 
					TimeDiff: GMT, 
					StartTime:new Date(item.timestart),
					EndTime: new Date(item.timeend),
					isHome:true
				}
			]
		
		for (let i = 0; i < item.subcities.length; i++)
			{
				// let checkIsHome = false;
				let date = new Date(new Date().toLocaleString("en-US", {timeZone: item.subcities[i].timezone}));
				let base = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));
				let GMT = date.getTime() - base.getTime();
				GMT /= 1000*3600;
				GMT += 7;
				city = [
					...city,
					{   Name: item.subcities[i].location, 
						Timezone: item.subcities[i].timezone, 
						TimeDiff: GMT, 
						StartTime:new Date(new Date().toLocaleString("en-US", {timeZone: item.subcities[i].timezone})),
						EndTime: new Date(new Date().toLocaleString("en-US", {timeZone: item.subcities[i].timezone})),
						isHome:false
					}
				]
			}
			this.setState({city: city});
			
			this.toggleEditEvent();
		}
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

	createEvent = async () => {

	}

	render() {
		return (
				<div class="table-responsive" style={{background:"#fff"}}>
					<div className="mr-2" style={{float: "right"}}>
						<Button color="primary" className="buttonCreateEvent" onClick={this.createEvent} href="/">Create</Button>
					</div>
					<Table class="table">
						<thead>
							<tr>
								<th>Event Name</th>
								<th>Description</th>
								<th>Hostname</th>
								<th>Host Location</th>
								<th>Invited Location</th>
								<th>Time Start</th>
								<th>Time End</th>
								<th>Edit/Delete</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.length > 0 && this.state.data.map((item, idx) => (
								<tr>
									<td>{item.eventname}</td>
									<td>{item.description}</td>
									<td>{item.hostname}</td>
									<td>{item.baselocation.split(',')[0]}</td>							
									<td>
										<ListGroup>
										{item.subcities.length > 0 && item.subcities.map((subitem, subidx) =>(											
											<ListGroupItem>{subitem.location.split(',')[0]}</ListGroupItem>
										))}
										</ListGroup>
									</td>
									<td>
										<ListGroup>
											<ListGroupItem>{
												new Date(item.timestart).getHours() + ":" +
												new Date(item.timestart).getMinutes()}</ListGroupItem>
											<ListGroupItem>{item.timestart.replace('-', '/').split('T')[0].replace('-', '/')}
											</ListGroupItem>
										</ListGroup>
									</td>
									<td>
										<ListGroup>
											<ListGroupItem>{
												new Date(item.timeend).getHours() + ":" +
												new Date(item.timeend).getMinutes()}</ListGroupItem>
											<ListGroupItem>{item.timeend.replace('-', '/').split('T')[0].replace('-', '/')}
											</ListGroupItem>
										</ListGroup>
									</td>
									<td>
										<Button color="warning" block className="buttonEditEvent" onClick={this.editEvent(item)}>Edit</Button>
										<Button color="danger" block className="buttonDeleteEvent" onClick={this.deleteEvent(item.eventid)}>Delete</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<Modal isOpen={this.state.showModalEditEvent} toggle={this.toggleEditEvent} className="editModal">
						<ModalHeader toggle={this.toggleEditEvent} className="editModalHeader">Edit event</ModalHeader >
						<ModalBody className="editModalBody">
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
							<FormGroup>
                                <Label for="exampleText">Event name</Label>
								<Input type="text" name="eventName" placeholder="Event name" 
									defaultValue={this.state.eventName}
                                    onChange={this.onChangeEventName}></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Event description</Label>
								<Input type="text" name="eventDescription" placeholder="Event description"
									defaultValue={this.state.eventDescription} 
                                    onChange={this.onChangeEventDescription}></Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleText">Host name</Label>
								<Input type="text" name="eventHostname" placeholder="Host name" 
									defaultValue={this.state.eventHostname}
                                    onChange={this.onChangeEventHostname}></Input>
                            </FormGroup>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" onClick={this.saveEdit}>Save</Button>
							<Button color="secondary" onClick={this.removeCity}>Cancel</Button>
						</ModalFooter>
					</Modal>
					<NotificationContainer/>
				</div>			
		);
	}
}
export default ListEvents;
