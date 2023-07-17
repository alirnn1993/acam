import React, {useEffect, useRef, useState} from "react";
import './App.css';


const Test = () => {


    let lines = [];

    const [tmp, setTmp] = useState([]);

    let lanes = [[{x: 20, y: 20}, {x: 30, y: 35}, {x: 35, y: 40}, {x: 32, y: 31}], [{x: 50, y: 20}, {
        x: 100,
        y: 20
    }, {x: 100, y: 70}, {x: 50, y: 70},]];
    let context;
    const canvas = useRef();


    useEffect(() => {
        if (canvas.current.getContext) {
            context = canvas.current.getContext('2d');
            // intitial draw
        }

    }, []);


    useEffect(() => {
        draw();
    }, [tmp.length])

    function draw() {
        context.clearRect(0, 0, canvas.current.width, canvas.current.height);
        context.save();
        // context.strokeStyle = 'grey';
        // context.beginPath();
        // for (var x = 0.5; x < 500; x += 50) {
        //     context.moveTo(x, 0);
        //     context.lineTo(x, 500);
        // }
        // for (var y = 0.5; y < 500; y += 50) {
        //     context.moveTo(0, y);
        //     context.lineTo(500, y);
        // }
        // context.stroke();
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.beginPath();
        // draw alle the lines
        lanes.forEach((shape, index) => {
            context.moveTo(shape[0].x, shape[0].y);
            shape.forEach((line, index) => {
                if (index !== 0)
                    context.lineTo(line.x, line.y);
            })
            if (shape.length > 2)
                context.lineTo(shape[0].x, shape[0].y);
        });
        console.log(tmp.length)
        if (tmp.length > 1) {
            tmp.forEach((point, index) => {
                console.log(point)
                console.log(index)
                if (index === 0)
                    context.moveTo(point.x, point.y);
                else context.lineTo(point.x, point.y);
            })
            context.lineTo(tmp[0].x, tmp[0].y);
        }


        context.stroke();
        context.restore();
    }





    return <div className={"App"}>

        <div>

            {/*<button onClick={addline}>Add line</button>*/}
        </div>

        <canvas ref={canvas}
                onClick={e => {

                    let rect = e.target.getBoundingClientRect();
                    let x = e.clientX - rect.left; //x position within the element.
                    let y = e.clientY - rect.top;  //y position within the element.
                    let array = tmp;
console.log(x);
console.log(y);

                    // array.push({x: x, y: y});
                    //
                    // setTmp(array);
                    // draw();
                }}
            // onMouseMove={e=>console.log(e)}
        ></canvas>

    </div>
};

export default Test;