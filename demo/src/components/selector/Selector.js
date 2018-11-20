import React, { Component } from 'react';
import './Selector.css';

class Selector extends Component {
    previous() {
        this.props.selectedCategoryChanged(-1);
    }

    next() {
        this.props.selectedCategoryChanged(1);
    }

    render() {
        let currentCategory = this.props.categories[this.props.selectedCategory];

        return (
            <div className="selector">
                <h4>
                    <i className="previous" onClick={() => this.previous()}>&lt;</i>
                    <span>{currentCategory && currentCategory.description}</span>
                    <i className="next" onClick={() => this.next()}>&gt;</i>
                </h4 >
            </div >
        );
    }
}

export default Selector;
