import React from 'react';
import './RangeSelectorItem.css';
import RangeSelector, { Shutter, Margin, Background, Image, Indent, SliderMarker, Scale, TickInterval, MinorTickInterval, Label, Behavior } from 'devextreme-react/range-selector';

function RangeSelectorItem(props) {
    const {range, startValue, endValue, numberCity, displayTime} = props;
    return(
        <div className="range-selector">
            <RangeSelector
                id="range-selector"
                defaultValue={range}   
                size={{height: 66 *numberCity, width:769}}
                onValueChanged = {displayTime}            
            >
                <Margin top={0} bottom={0}/>
                <Background>
                    <Image url="images/RangeImage.png" location="full" width="100" height="100" />
                </Background>                  
                <Indent left={0} right={0}/>
                <SliderMarker placeholderHeight={20} format="shorttime" />
                <Shutter opacity={0.4}></Shutter>
                <Scale startValue={startValue} endValue={endValue} placeholderHeight={-20} style={{"font-weight": "bold"}}>
                    <TickInterval hours={1} />
                    <MinorTickInterval hours={0.5} />
                    <Label format="shorttime" />
                </Scale>
                <Behavior callValueChanged="onMoving">                      
                </Behavior>
            </RangeSelector>
        </div>
    );
}

export default RangeSelectorItem;