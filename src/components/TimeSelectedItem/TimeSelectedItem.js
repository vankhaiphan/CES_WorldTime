import React from 'react';
import './TimeSelectedItem.css';

function TimeSelectedItem(props) {
    const {item} = props;
    return(
        <div className="TimeSelectedItem">
            <div className="icon" id="home">                                               
                <span>{item.TimeDiff}</span>
            </div>
            <div className="location">
                <span className="city">
                    <b>{item.Name.split(',')[0]}</b>
                    {
                        (item.isHome === true) ? 
                            <small>{"HOME"}</small>
                            :null
                    } 
                </span>
                <div className="country">{item.Timezone}</div>
            </div>
            <div className="data">
                <div className="data-begin">
                    <div className="time">
                        {item.StartTime.getHours() < 13?
                            <span className="th">{item.StartTime.getHours()}</span>:
                            <span className="th">{item.StartTime.getHours()-12}</span>
                        }
                        <span className="ts">:</span>
                        <span className="tm">{item.StartTime.getMinutes()}</span>
                        {item.StartTime.getHours() < 13?
                            <span className="ampm">am</span>:
                            <span className="ampm">pm</span>
                        }                                                        
                    </div>                                                                                             
                    <div className="date">{item.StartTime.toDateString().split(" ",3)[0] 
                        + ", " + item.StartTime.toDateString().split(" ",3)[1] 
                        + " " + item.StartTime.toDateString().split(" ",3)[2]}
                    </div>
                </div>
                {item.StartTime.getHours() === item.EndTime.getHours()?
                    <span className="separate"></span>:
                    <span className="separate">-</span>
                }
                {item.StartTime.getHours() === item.EndTime.getHours()?
                    <div className="data-end"></div>:
                    [
                        <div className="data-end">
                            <div className="time">
                                {item.EndTime.getHours() < 13?
                                    <span className="th">{item.EndTime.getHours()}</span>:
                                    <span className="th">{item.EndTime.getHours()-12}</span>
                                }                                                                
                                <span className="ts">:</span>
                                <span className="tm">{item.EndTime.getMinutes()}</span>
                                {item.EndTime.getHours() < 13?
                                    <span className="ampm">am</span>:
                                    <span className="ampm">pm</span>
                                }                                                        
                            </div>                                                                                             
                            <div className="date">{item.EndTime.toDateString().split(" ",3)[0] 
                                + ", " + item.EndTime.toDateString().split(" ",3)[1] 
                                + " " + item.EndTime.toDateString().split(" ",3)[2]}
                            </div>
                        </div>      
                    ]                                                  
                }                                                                                          
            </div>
        </div>
    );
}

export default TimeSelectedItem;