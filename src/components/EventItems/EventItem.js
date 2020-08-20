import React, { Component } from "react";

class EventItem extends Component {
  render() {
    return (
      <tr>
        <td>Hoang's Meeting</td>
        <td>07:30</td>
        <td>10:30</td>
        <td>Ha Noi</td>
        <td>New York</td>
        <td>Planfor next week</td>
        <td>
          <div class="btn-group">
            <button type="button" class="btn btn-primary">
              Edit
            </button>
            <button type="button" class="btn btn-primary">
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }
}
export default EventItem;
