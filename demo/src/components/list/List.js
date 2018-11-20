import React, { Component } from 'react';
import Meme from '../meme/Meme';
import './List.css';

class List extends Component {
    render() {
        return (
            <div className="list">
                {
                    this.props.memes.map((meme, index) => {
                        let key = `${meme.category}_${index}`;

                        return <Meme key={key} meme={meme}></Meme>;
                    })
                }
            </div>
        );
    }
}

export default List;