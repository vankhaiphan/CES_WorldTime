import React from 'react';
import './SearchItem.css';
import PlacesAutocomplete from "react-places-autocomplete";

function SearchItem(pros) {
    const {address, handleChange, handleSelect} = pros;
    return(
        <PlacesAutocomplete
            value={address}
            searchOptions={{types:['(cities)']}}
            onChange={handleChange}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div class="search-result">
                    <input
                        {...getInputProps({
                            placeholder: 'Place',
                            className: 'location-search-input',
                        })}
                        />
                    <div className="autocomplete-dropdown-container" style={{display: `${suggestions.length ? 'block' : 'none'}`}}>
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                            ? 'suggestion-item--active'
                            : 'suggestion-item';
                            // inline style for demonstration purpose
                            const style = suggestion.active
                            ? { backgroundColor: '#888', cursor: 'pointer' }
                            : { backgroundColor: '#fff', cursor: 'pointer' };
                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                                })}
                            >
                                <span>{suggestion.description}</span>
                            </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
}

export default SearchItem;