import React, { Component } from "react";
import EventItem from "../EventItems/EventItem";
import { Table, Button, ListGroup, ListGroupItem } from 'reactstrap';
import userService from '../../api/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

class ListEvents extends Component {
	state = {
		data : [
		],
	}
	constructor(props){
		super(props);
		this.onSubmitGetEvent();
		this.deleteEvent = this.deleteEvent.bind(this);
		this.editEvent = this.editEvent.bind(this);
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

	editEvent = (eventid) => {
		return async(event) => {

		}
	}

	createEvent = async () => {

	}

	render() {
		return (
				<div class="table-responsive">
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
										<Button color="warning" block className="buttonEditEvent" onClick={this.editEvent(item.eventid)}>Edit</Button>
										<Button color="danger" block className="buttonDeleteEvent" onClick={this.deleteEvent(item.eventid)}>Delete</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<NotificationContainer/>
				</div>			
		);
	}
}
export default ListEvents;
