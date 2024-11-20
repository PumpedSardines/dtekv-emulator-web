import React, { useEffect, useRef } from "react";
import { useRatioBox } from "../../../../components/RatioBox";
import { vgaBufferAtom } from "../../../../atoms";
import { useAtomValue } from "jotai";

function Vga() {
  const vgaFrameBuffer = useAtomValue(vgaBufferAtom);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width, height } = useRatioBox();

  useEffect(() => {
    const abortController = new AbortController();

    if (!vgaFrameBuffer) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl")!;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader code
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_texCoord;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texCoord = (a_position + 1.0) * 0.5;
        }
    `;

    // Fragment shader code
    const fragmentShaderSource = `
        precision mediump float;
        varying vec2 v_texCoord;
        uniform sampler2D u_texture;
        void main() {
          gl_FragColor = texture2D(u_texture, vec2(v_texCoord.x, 1.0 - v_texCoord.y));
        }
    `;

    // Compile shader
    function compileShader(
      gl: WebGLRenderingContext,
      source: string,
      type: number,
    ) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Failed to create shader");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error("Failed to compile shader");
      }
      return shader;
    }

    // Initialize shaders and program
    const vertexShader = compileShader(
      gl,
      vertexShaderSource,
      gl.VERTEX_SHADER,
    );
    const fragmentShader = compileShader(
      gl,
      fragmentShaderSource,
      gl.FRAGMENT_SHADER,
    );
    const program = gl.createProgram();
    if (!program) throw new Error("Failed to create program");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up rectangle vertices
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture to hold the pixel data
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Function to update texture with SharedArrayBuffer data
    function updateTexture() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGB,
        320,
        240,
        0,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        vgaFrameBuffer,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Continuously render the shared buffer content
    function render() {
      updateTexture();
      if (!abortController.signal.aborted) requestAnimationFrame(render);
    }

    // Start rendering
    render();

    return () => {
      abortController.abort();
      canvas.getContext("webgl")!.clearColor(0, 0, 0, 1);
    };
  }, [vgaFrameBuffer, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default React.memo(Vga);
