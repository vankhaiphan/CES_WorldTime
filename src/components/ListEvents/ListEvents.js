import React, { Component } from "react";
import EventItem from "../EventItems/EventItem";
import { Table, Button } from 'reactstrap';
import userService from '../../api/userService';

class ListEvents extends Component {
	state = {
		data : [
		],
		subCities:[	
		]
	}
	constructor(props){
		super(props);
		this.onSubmitGetEvent();
		this.deleteEvent = this.deleteEvent.bind(this);
	}
	onSubmitGetEvent = async () => {
		let dataReceive = await userService.getEventList();
		let subCities = []
		for (let i = 0; i < dataReceive.length; i++)
		{
			if (dataReceive[i].subcities.length > 0)
			{
				let j = 0;
				let cities = "";
				while (j < dataReceive[i].subcities.length)
				{
					if (j === dataReceive[i].subcities.length - 1)
						cities += dataReceive[i].subcities[j].location.split(',')[0];
					else
						cities += dataReceive[i].subcities[j].location.split(',')[0] + " ,";
					j += 1;
				}
				subCities[i] = cities;
			}
			else{
				subCities[i] = ""
			}
		}
		this.setState({data: dataReceive, subCities: subCities})
		console.log("list: ",this.state.data);
		console.log("list subcities: ",this.state.subCities);
	}
	
	deleteEvent = (eventid) => {
		return async(event) => {
			let dataReceive = await userService.deleteEvent(eventid);
			await window.location.reload();
		}
		
	}

	render() {
		return (
				<div class="table-responsive">
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
								<th>Edit or Delete</th>
							</tr>
						</thead>
						<tbody>
							{this.state.data.length > 0 && this.state.data.map((item, idx) => (
								<tr>
									<td>{item.eventname}</td>
									<td>{item.description}</td>
									<td>{item.hostname}</td>
									<td>{item.baselocation.split(',')[0]}</td>							
									<td>{this.state.subCities[idx]}</td>
									<td>{item.timestart}</td>
									<td>{item.timeend}</td>
									<td><Button color="danger" className="buttonDeleteEvent" onClick={this.deleteEvent(item.eventid)}>Delete</Button></td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>
			
		);
	}
}
export default ListEvents;
