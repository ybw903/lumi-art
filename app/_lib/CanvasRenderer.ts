import {
  FRAGMENT_SHADER_SOURCE,
  VERTEX_SHADER_SOURCE,
} from "../_constants/shader";
import { compileFragmentShader, compileVertexShader } from "../_utils/shader";
import { AdjustmentParameters, Dimensions, TransformParameters } from "./types";

const VERTICES = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);

export class CanvasRenderer {
  private state: "idle" | "ready" = "idle";
  private context: WebGLRenderingContext;
  private program: WebGLProgram;
  private uniformLocations!: Map<
    string,
    { type: number; location: WebGLUniformLocation }
  >;

  constructor(private canvasEl: HTMLCanvasElement) {
    const gl = canvasEl.getContext("webgl");
    if (gl === null) {
      throw new Error("Can not use webgl...");
    }
    this.context = gl;

    const vertexShader = compileVertexShader(gl, VERTEX_SHADER_SOURCE);
    const fragmentShader = compileFragmentShader(gl, FRAGMENT_SHADER_SOURCE);

    const program = gl.createProgram();

    if (program === null) {
      throw new Error("fail create program...");
    }

    if (vertexShader === null) {
      throw new Error("fail compile vertex shader...");
    }

    if (fragmentShader === null) {
      throw new Error("fail compile fragment shader...");
    }

    this.clearCanvas();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    this.program = program;
    this.loadUniforms();
  }

  public getState() {
    return this.state;
  }

  public setImage(image: ImageData | HTMLImageElement) {
    const gl = this.context;

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.state = "ready";
  }

  public render({
    sourceDimensions,
    // renderDimensions,
    transform,
    adjustments,
  }: {
    sourceDimensions: Dimensions;
    renderDimensions: Dimensions;
    transform: TransformParameters;
    adjustments: AdjustmentParameters;
  }) {
    if (this.state === "idle") {
      throw new Error("set image function not called.");
    }

    const gl = this.context;

    this.canvasEl.width = sourceDimensions.width;
    this.canvasEl.height = sourceDimensions.height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(this.program, "position");
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    const sourceAspectRatio = sourceDimensions.height / sourceDimensions.width;

    this.setUniform("sourceAspectRatio", sourceAspectRatio);
    this.setUniform(
      "desqueezeAspect",
      new Float32Array([transform.dx, transform.dy])
    );

    this.setUniform(
      "translation",
      new Float32Array([transform.cx - 0.5, transform.cy - 0.5])
    );
    this.setUniform("rotation", transform.adjust);

    this.setUniform("brightness", adjustments.brightness);
    this.setUniform("exposure", adjustments.exposure);
    this.setUniform("contrast", adjustments.contrast);
    this.setUniform("highlights", adjustments.highlights);
    this.setUniform("shadows", adjustments.shadows);
    this.setUniform("saturation", adjustments.saturation);
    this.setUniform("warmth", adjustments.warmth);
    this.setUniform("tint", adjustments.tint);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  private clearCanvas() {
    const gl = this.context;
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  private loadUniforms() {
    const gl = this.context;

    this.uniformLocations = new Map();

    const numUniforms = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_UNIFORMS
    );

    for (let i = 0; i < numUniforms; i++) {
      const activeInfo = gl.getActiveUniform(this.program, i);
      if (activeInfo === null) {
        throw new Error(`Can't get uniform at ${i}...`);
      }

      const location = gl.getUniformLocation(this.program, activeInfo.name);
      if (location) {
        this.uniformLocations.set(activeInfo.name, {
          type: activeInfo.type,
          location,
        });
      }
    }
  }

  private setUniform(name: string, value: number | Float32Array | Int32Array) {
    const gl = this.context;

    if (!this.uniformLocations.has(name)) {
      console.warn(`unknown uniform ${name} name`);
      return;
    }

    const info = this.uniformLocations.get(name);

    if (!info) {
      console.warn(`unknown uniform ${name} name`);
      return;
    }

    switch (info.type) {
      case gl.FLOAT:
        if (typeof value !== "number") {
          console.warn(`incorrect number type value`);
          break;
        }
        gl.uniform1fv(info.location, [value]);
        break;
      case gl.FLOAT_VEC2:
        if (!(value instanceof Float32Array)) {
          console.warn(`incorrect float32array type value`);
          break;
        }
        gl.uniform2fv(info.location, value);
        break;
      case gl.FLOAT_VEC3:
        if (!(value instanceof Float32Array)) {
          console.warn(`incorrect float32array type value`);
          break;
        }
        gl.uniform3fv(info.location, value);
        break;
      case gl.FLOAT_VEC4:
        if (!(value instanceof Float32Array)) {
          console.warn(`incorrect float32array type value`);
          break;
        }
        gl.uniform4fv(info.location, value);
        break;
      case gl.BOOL:
      case gl.INT:
        if (typeof value !== "number") {
          console.warn(`incorrect number type value`);
          break;
        }
        gl.uniform1iv(info.location, [value]);
        break;
      case gl.BOOL_VEC2:
      case gl.INT_VEC2:
        if (!(value instanceof Int32Array)) {
          console.warn(`incorrect int32array type value`);
          break;
        }
        gl.uniform2iv(info.location, value);
        break;
      case gl.BOOL_VEC3:
      case gl.INT_VEC3:
        if (!(value instanceof Int32Array)) {
          console.warn(`incorrect int32array type value`);
          break;
        }
        gl.uniform3iv(info.location, value);
        break;
      case gl.BOOL_VEC4:
      case gl.INT_VEC4:
        if (!(value instanceof Int32Array)) {
          console.warn(`incorrect int32array type value`);
          break;
        }
        gl.uniform4iv(info.location, value);
        break;
      default:
        console.warn(`unknown uniform ${name} type`);
    }
  }
}
