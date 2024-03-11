import * as CG from './transforms.js';

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
                    transform: []
                }
            ],
            slide1: [],
            slide2: [
                {
                    square: [],
                    transform: null
                },
                {
                    triangle: [],
                    transform: null
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
        // TODO: update any transformations needed for animation
        if(this.slide_idx === 0) {
            for(let i=0; i<this.models.slide0[0].circle.length; i++) {  // Iterate through the vertices
                let p = this.models.slide0[0].circle[i];                // Point in homogenous coord form
                CG.mat3x3Identity(this.models.slide0[0].transform)      // Init transform (dont know how to do that)
                let tx = 5;
                let ty = 2;
                CG.mat3x3Translate(this.models.slide0[0].transform, tx, ty);    // Apply translate matrix to transform
                this.models.slide0[0].circle[i] = this.models.slide0[0].transform   // Set new point to the result of trans matrix * og point
            }
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
        this.drawConvexPolygon(this.models.slide0[0].circle, black);
    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
        
        
    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions
        
        let squareVertices = [CG.Vector3(400, 300, 1), CG.Vector3(400, 400, 1),CG.Vector3(500, 400, 1),CG.Vector3(500, 300, 1)];
        let black = [0,0,0,255];
        this.models.slide2[0].square = squareVertices;
        this.drawConvexPolygon(this.models.slide2[0].square, black);

        let triangleVertices = [CG.Vector3(100, 100, 1), CG.Vector3(200,200,1), CG.Vector3(300,100,1)];
        this.models.slide2[1].triangle = triangleVertices;
        this.drawConvexPolygon(this.models.slide2[1].triangle, black)

        this.models.slide2[0].transform = CG.mat3x3Translate;
        this.models.slide2[1].transform = CG.mat3x3Translate; 
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
