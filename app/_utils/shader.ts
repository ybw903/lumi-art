export const compileVertexShader = (
  gl: WebGLRenderingContext,
  shaderSrc: string
) => {
  const shader = gl.createShader(gl.VERTEX_SHADER);

  if (!shader) return null;
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  // [TODO] shader compile error
  return shader;
};

export const compileFragmentShader = (
  gl: WebGLRenderingContext,
  shaderSrc: string
) => {
  const shader = gl.createShader(gl.FRAGMENT_SHADER);

  if (!shader) return null;
  gl.shaderSource(shader, shaderSrc);
  gl.compileShader(shader);

  // [TODO] shader compile error
  return shader;
};
