import * as CG from './transforms.js';
import { Matrix } from "./matrix.js";

class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        let center = { x: 400, y: 300 };
        let radius = 50;
        let segments = 32;

        this.models = {
            slide0: [
                {
                    circle: this.generateCircleVertices(center, radius, segments),
                    centerX: center.x,
                    centerY: center.y,
                    vel_x: 120,
                    vel_y: 30,
                    tx: 120,
                    ty: 30,
                    transform: new Matrix(3, 3)
                }
            ],
            slide1: [
                {
                    square: [CG.Vector3(400, 300, 1), CG.Vector3(400, 400, 1),CG.Vector3(500, 400, 1),CG.Vector3(500, 300, 1)],
                    transform1: new Matrix(3,3),
                    transform2: new Matrix(3,3),
                    transform3: new Matrix(3,3),
                    rotationSpeed: 5,
                    centerX: 450,
                    centerY: 350 
                },
                {
                    triangle: [CG.Vector3(100, 100, 1), CG.Vector3(200,200,1), CG.Vector3(300,100,1)],
                    transform1: new Matrix(3,3),
                    transform2: new Matrix(3,3),
                    transform3: new Matrix(3,3),
                    rotationSpeed: -10,
                    centerX: 200,
                    centerY: 150
                }
            ],
            slide2: [
                {
                    square: [CG.Vector3(400, 300, 1), CG.Vector3(400, 400, 1),CG.Vector3(500, 400, 1),CG.Vector3(500, 300, 1)],
                    transform1: new Matrix(3,3),
                    transform2: new Matrix(3,3),
                    transform3: new Matrix(3,3),
                    centerX: 450,
                    centerY: 350 
                },
                {
                    triangle: [CG.Vector3(100, 100, 1), CG.Vector3(200,200,1), CG.Vector3(300,100,1)],
                    transform1: new Matrix(3,3),
                    transform2: new Matrix(3,3),
                    transform3: new Matrix(3,3),
                    centerX: 200,
                    centerY: 150
                }
            ],
            slide3: []
        };
    }
    

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation\
        let model;
        switch (this.slide_idx) {
            case 0:
                model = this.models.slide0[0]
                CG.mat3x3Identity(model.transform)
                
                model.tx += model.vel_x*delta_time/1000;
                model.ty += model.vel_y*delta_time/1000;
                CG.mat3x3Translate(model.transform, model.tx, model.ty);    // Apply translate matrix to transform

                if ((model.centerX + model.radius > this.canvas.width) || (model.centerX - model.radius <= 0)) {
                    model.vel_x *= -1; // Reverse X velocity
                }
                if ((model.centerY + model.radius > this.canvas.height) || (model.centerY - model.radius <= 0)) {
                    model.vel_y *= -1; // Reverse Y velocity
                }
                break;
                
            case 1:
                model = this.models.slide1;
                CG.mat3x3Translate(model[0].transform1, -model[0].centerX, -model[0].centerY);
                CG.mat3x3Rotate(model[0].transform2, -6 * time / 1000);
                CG.mat3x3Translate(model[0].transform3, model[0].centerX, model[0].centerY);

                CG.mat3x3Translate(model[1].transform1, -model[1].centerX, -model[1].centerY);
                CG.mat3x3Rotate(model[1].transform2, 3 * time / 1000);
                CG.mat3x3Translate(model[1].transform3, model[1].centerX, model[1].centerY);
                break;

            case 2:
                model = this.models.slide2;
                CG.mat3x3Translate(model[0].transform1, -model[0].centerX, -model[0].centerY);
                CG.mat3x3Scale(model[0].transform2, 2 * time / 1000, 3 * time / 1000);
                CG.mat3x3Translate(model[0].transform3, model[0].centerX, model[0].centerY);

                CG.mat3x3Translate(model[1].transform1, -model[1].centerX, -model[1].centerY);
                CG.mat3x3Scale(model[1].transform2, 0.3 * time / 1000, 0.6 * time / 1000);
                CG.mat3x3Translate(model[1].transform3, model[1].centerX, model[1].centerY);
                break;
        }
    }


    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)

        // Circle properties
        let black = [0, 0, 0, 255];
        let new_vx = [];
        let model = this.models.slide0[0];

        for(let i=0; i<model.circle.length; i++) {
            let p = model.circle[i];
            new_vx.push(Matrix.multiply([model.transform, p]));
        }
        let center = CG.Vector3(model.pos.x, model.pos.y, 1);
        let new_pos = Matrix.multiply([model.transform, center]);
        model.pos.x = new_pos[0];
        model.pos.y = new_pos[1];
        this.drawConvexPolygon(new_vx, black);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let black = [0,0,0,255];
        let newSquare = [];
        let newTriangle = [];
        let model = this.models.slide1;

        for(let i=0; i<model[0].square.length; i++) {
            let p = model[0].square[i];
            p = Matrix.multiply([model[0].transform1, p]);
            p = Matrix.multiply([model[0].transform2, p]);
            newSquare.push(Matrix.multiply([model[0].transform3, p]));
        }
        this.drawConvexPolygon(newSquare, black);

        for(let i=0; i<model[1].triangle.length; i++) {
            let p = model[1].triangle[i];

            p = Matrix.multiply([model[1].transform1, p]);
            p = Matrix.multiply([model[1].transform2, p]);
            newTriangle.push(Matrix.multiply([model[1].transform3,p]));
            
        }
        this.drawConvexPolygon(newTriangle, black);
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        
        let black = [0,0,0,255];
        let newSquare = [];
        let newTriangle = [];
        let model = this.models.slide2;

        for(let i=0; i<model[0].square.length; i++) {
            let p = model[0].square[i];
            p = Matrix.multiply([model[0].transform1, p]);
            p = Matrix.multiply([model[0].transform2, p]);
            newSquare.push(Matrix.multiply([model[0].transform3, p]));
        }
        this.drawConvexPolygon(newSquare, black);

        for(let i=0; i<model[1].triangle.length; i++) {
            let p = model[1].triangle[i];

            p = Matrix.multiply([model[1].transform1, p]);
            p = Matrix.multiply([model[1].transform2, p]);
            newTriangle.push(Matrix.multiply([model[1].transform3,p]));
            
        }
        this.drawConvexPolygon(newTriangle, black);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    // Helper method to make circles and add vertices to model
    generateCircleVertices(center, radius, segments) {
        let vertices = [];
        for (let i = 0; i < segments; i++) {
            let theta = (2 * Math.PI / segments) * i;
            let x = center.x + radius * Math.cos(theta);
            let y = center.y + radius * Math.sin(theta);
            vertices.push(CG.Vector3(x, y, 1));
        }
        return vertices;
    }
};

export { Renderer };
