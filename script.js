AFRAME.registerShader("myshader", {
  schema: {
    uMap: { type: "map", is: "uniform" },
  },
  vertexShader: `
                varying vec2 vUv;

                void main() {
                    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0 );
                    vec3 vWorldPosition = worldPosition.xyz;
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
                `,
  fragmentShader: `
                varying vec2 vUv;
                uniform sampler2D uMap;

                void main() {
                    vec2 uv = vUv;
                    vec4 tex1 = texture2D(uMap, uv * 1.0);
                    if (tex1.g > 0.5)
                        gl_FragColor = tex1;
                    else
                        gl_FragColor = vec4(0,0,0,0);
                }`,
});

let rooms;

async function start() {
  const result = await fetch("./rooms.json");
  rooms = await result.json();

  applyRoom();
}

start();

let current = "secretariat_1";

const $linksContainer = document.querySelector("#links");
const $sky = document.querySelector("#image-360");
const $cursor = document.querySelector("#cursor");

$cursor.setAttribute("material", "color", "#ffffff");

function applyRoom() {
  const room = rooms[current];

  $sky.setAttribute("src", `#${room.image}`);

  // Clear old links
  $linksContainer.innerHTML = "";

  // Create new links
  room.links.forEach((link) => {
    let timeoutId;
    const linkEntity = document.createElement("a-entity");
    linkEntity.setAttribute("rotation", link.rotation);

    const sphere = document.createElement("a-sphere");
    sphere.setAttribute("position", "-5 0 0");
    sphere.setAttribute("radius", "0.2");
    sphere.setAttribute("material", "shader: standard; color: #e01b24;");
    sphere.setAttribute("class", "link");
    sphere.setAttribute("sound", "on: click; src: #click-sound");
    sphere.setAttribute("animation__pulse", {
      property: "scale",
      dir: "alternate",
      dur: 1000, // 1 second per pulse
      loop: true,
      easing: "easeInOutSine",
      to: "1.4 1.4 1.4", // maximum scale
    });

    // Navigation
    sphere.addEventListener("click", () => {
      current = link.target;
      applyRoom();
    });

    sphere.addEventListener("mouseenter", () => {
      const tooltip = document.createElement("a-text");

      tooltip.setAttribute("color", "#e01b24");
      tooltip.setAttribute("position", "0 0.3 0");
      tooltip.setAttribute("rotation", { x: 0, y: 90, z: 0 });
      tooltip.setAttribute("align", "center");
      tooltip.setAttribute("width", "4");
      tooltip.setAttribute("material", "shader:myshader;");
      tooltip.setAttribute("value", rooms[link.target].label);
      sphere.appendChild(tooltip);

      // Animate to red
      $cursor.setAttribute(
        "animation__color",
        "property: material.color; to: #e01b24; dur: 2000; easing: easeInOutSine"
      );

      timeoutId = setTimeout(() => {
        current = link.target;

        applyRoom();
      }, 2000);
    });

    sphere.addEventListener("mouseleave", () => {
      sphere.innerHTML = "";
      $cursor.removeAttribute("animation__color");
      $cursor.setAttribute("material", "color", "#ffffff");

      clearTimeout(timeoutId);
    });

    linkEntity.appendChild(sphere);
    $linksContainer.appendChild(linkEntity);
  });
}
