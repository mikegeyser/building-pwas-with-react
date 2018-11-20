import React, { Component } from 'react';
import './Meme.css';

class Meme extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.drawCanvas(this.props.meme);
    }

    componentDidUpdate() {
        this.drawCanvas(this.props.meme);
    }

    drawCanvas(meme) {
        if (!this.canvas.current) return;

        const context = this.canvas.current.getContext("2d");

        const draw = function () {
            context.canvas.width = image.width;
            context.canvas.height = image.height;
            context.drawImage(image, 0, 0);

            if (meme['offline']) {
                var imageData = context.getImageData(0, 0, image.width, image.height);
                var data = imageData.data;

                for (var i = 0; i < data.length; i += 4) {
                    var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    data[i] = brightness; // red
                    data[i + 1] = brightness; // green
                    data[i + 2] = brightness; // blue
                }

                // overwrite original image
                context.putImageData(imageData, 0, 0);
            }

            context.font = "100px Impact";
            context.fillStyle = 'white';
            context.strokeStyle = 'black';
            context.lineWidth = 4;
            context.textAlign = 'center';

            // Write top line 
            if (meme.top) {
                context.fillText(meme.top.toUpperCase(), context.canvas.width / 2, 90, context.canvas.width - 10);
                context.strokeText(meme.top.toUpperCase(), context.canvas.width / 2, 90, context.canvas.width - 10);
            }

            // Write bottom line 
            if (meme.bottom) {
                context.fillText(meme.bottom.toUpperCase(), context.canvas.width / 2, context.canvas.height - 10, context.canvas.width - 10);
                context.strokeText(meme.bottom.toUpperCase(), context.canvas.width / 2, context.canvas.height - 10, context.canvas.width - 10);
            }
        };

        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = draw.bind(this, []);
        image.src = meme.template;
    }

    render() {

        return (
            <div className="meme">
                <canvas ref={this.canvas} >
                </canvas>
            </div>
        );
    }
}

export default Meme;