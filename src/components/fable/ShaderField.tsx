"use client";

import { useEffect, useRef } from "react";

// A slow field of light, drawn on the GPU: domain-warped noise in ink and violet
// that leans toward the pointer. It renders only while on screen, at a capped
// resolution and falls back to a single still frame for reduced motion.

const FRAG = `
precision highp float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform vec2 f; uniform float k;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),u=fract(p);u=u*u*(3.-2.*u);
  return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){
  float asp=r.x/r.y;
  vec2 p=(gl_FragCoord.xy/r-.5)*vec2(asp,1.);
  vec2 mm=(m-.5)*vec2(asp,1.);
  vec2 fc=(f-.5)*vec2(asp,1.);
  float d=length(p-mm);
  vec2 s=p+.16*(p-mm)*exp(-d*2.6);
  vec2 q=vec2(fbm(s*1.3+t*.045),fbm(s*1.3+vec2(5.2,1.3)-t*.04));
  vec2 w=vec2(fbm(s*1.1+2.8*q+vec2(1.7,9.2)+t*.03),fbm(s*1.1+2.8*q+vec2(8.3,2.8)-t*.02));
  float v=fbm(s+3.*w);
  vec3 c=vec3(.031,.031,.039);
  c=mix(c,vec3(.20,.11,.52),smoothstep(.30,.72,v));
  c=mix(c,vec3(.56,.44,1.),smoothstep(.42,.9,v*length(w)*1.25));
  c=mix(c,vec3(1.,.78,.62),smoothstep(.62,1.05,v*w.x*1.9)*.55);
  float mask=smoothstep(1.05,.05,length((p-fc)*vec2(.8,1.)));
  mask=max(mask,.55*exp(-d*3.2));
  c=mix(vec3(.031,.031,.039),c,mask*k);
  c+=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*.03;
  gl_FragColor=vec4(c,1.);
}`;
const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

export function ShaderField({
  className = "",
  focus = [0.72, 0.42],
  strength = 1,
}: {
  className?: string;
  /** Where the light gathers, in 0–1 of the canvas, from the bottom-left. */
  focus?: [number, number];
  strength?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fx, fy] = focus;

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const U = (name: string) => gl.getUniformLocation(prog, name);
    const uR = U("r"), uT = U("t"), uM = U("m"), uF = U("f"), uK = U("k");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: fx, y: fy, tx: fx, ty: fy };
    let visible = true;
    let raf = 0;
    const t0 = performance.now();

    const size = () => {
      const scale = Math.min(window.devicePixelRatio, 1.25) * 0.75;
      const w = Math.max(2, Math.round(canvas.clientWidth * scale));
      const hh = Math.max(2, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== hh) {
        canvas.width = w;
        canvas.height = hh;
        gl.viewport(0, 0, w, hh);
      }
    };
    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, (performance.now() - t0) / 1000 + 20);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.uniform2f(uF, fx, fy);
      gl.uniform1f(uK, strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => {
      if (!visible) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - b.left) / b.width;
      mouse.ty = 1 - (e.clientY - b.top) / b.height;
    };
    const ro = new ResizeObserver(() => {
      size();
      if (still) draw();
    });
    ro.observe(canvas);
    size();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !still) loop();
    });
    io.observe(canvas);
    if (still) draw();
    else window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [fx, fy, strength]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
