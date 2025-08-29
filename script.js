const rooms = {
  couloir_1: {
    image: "1_couloir_1",
    links: [
      { target: "rez_couloir_3", rotation: { x: 0, y: 200, z: 20 } },
      { target: "couloir_2", rotation: { x: 0, y: 0, z: 0 } },
      { target: "couloir_3", rotation: { x: 0, y: -130, z: 0 } },
    ],
  },
  couloir_2: {
    image: "1_couloir_2",
    links: [
      { target: "couloir_1", rotation: { x: 0, y: -185, z: 0 } },
      { target: "hall_1", rotation: { x: 0, y: -90, z: 0 } },
      { target: "salle_107", rotation: { x: 0, y: -200, z: 0 } },
      { target: "salle_111", rotation: { x: 0, y: -75, z: 0 } },
      { target: "secretariat_1", rotation: { x: 0, y: -75, z: 10 } },
    ],
  },
  couloir_3: {
    image: "1_couloir_3",
    links: [
      { target: "couloir_1", rotation: { x: 0, y: 3, z: 0 } },
      { target: "passerelle", rotation: { x: 0, y: 183, z: 0 } },
    ],
  },
  hall_1: {
    image: "1_hall",
    links: [
      { target: "rez_accueil", rotation: { x: 0, y: 245, z: 30 } },
      { target: "hall_2", rotation: { x: 0, y: 195, z: 0 } },
      { target: "couloir_2", rotation: { x: 0, y: 170, z: 0 } },
    ],
  },
  passerelle: {
    image: "1_passerelle",
    links: [
      { target: "couloir_3", rotation: { x: 0, y: 205, z: 0 } },
      { target: "secretariat_2", rotation: { x: 0, y: 7, z: 0 } },
    ],
  },
  salle_107: {
    image: "1_salle107",
    links: [{ target: "couloir_2", rotation: { x: 0, y: 45, z: 0 } }],
  },
  salle_111: {
    image: "1_salle111",
    links: [{ target: "couloir_2", rotation: { x: 0, y: 155, z: 0 } }],
  },
  secretariat_1: {
    image: "1_secretariat_1",
    links: [{ target: "couloir_2", rotation: { x: 0, y: 17, z: 0 } }],
  },
  secretariat_2: {
    image: "1_secretariat_2",
    links: [{ target: "passerelle", rotation: { x: 0, y: 235, z: 0 } }],
  },
  hall_2: {
    image: "2_hall",
    links: [{ target: "hall_1", rotation: { x: 0, y: 200, z: 30 } }],
  },
  rez_accueil: {
    image: "rez_accueil",

    links: [
      { target: "rez_entree", rotation: { x: 0, y: 185, z: 0 } },
      { target: "hall_1", rotation: { x: 0, y: -45, z: 0 } },
      { target: "rez_couloir", rotation: { x: 0, y: -90, z: 0 } },
    ],
  },
  rez_atelier: {
    image: "rez_atelier",
    links: [{ target: "rez_couloir_3", rotation: { x: 0, y: 180, z: 0 } }],
  },
  rez_batiment: {
    image: "rez_batiment",
    links: [{ target: "rez_entree", rotation: { x: 0, y: 2, z: 0 } }],
  },
  rez_couloir_2: {
    image: "rez_couloir_2",
    links: [
      { target: "rez_couloir", rotation: { x: 0, y: -173, z: 0 } },
      { target: "rez_couloir_3", rotation: { x: 0, y: 95, z: 0 } },
    ],
  },
  rez_couloir_3: {
    image: "rez_couloir_3",
    links: [
      { target: "rez_couloir_2", rotation: { x: 0, y: 175, z: 0 } },
      { target: "couloir_1", rotation: { x: 0, y: -15, z: -20 } },
      { target: "rez_atelier", rotation: { x: 0, y: 65, z: 0 } },
    ],
  },
  rez_couloir: {
    image: "rez_couloir",
    links: [
      { target: "rez_accueil", rotation: { x: 0, y: 180, z: 0 } },
      { target: "rez_couloir_2", rotation: { x: 0, y: 0, z: 0 } },
    ],
  },
  rez_entree: {
    image: "rez_entree",
    links: [
      { target: "rez_accueil", rotation: { x: 0, y: 185, z: 0 } },
      { target: "rez_batiment", rotation: { x: 0, y: 10, z: 0 } },
    ],
  },
};

let current = "secretariat_1";

const $linksContainer = document.querySelector("#links");
const $sky = document.querySelector("#image-360");

applyRoom();

function applyRoom() {
  const room = rooms[current];

  $sky.setAttribute("src", `#${room.image}`);

  // Clear old links
  $linksContainer.innerHTML = "";

  // Create new links
  room.links.forEach((link) => {
    const linkEntity = document.createElement("a-entity");
    linkEntity.setAttribute("rotation", link.rotation);

    const sphere = document.createElement("a-sphere");
    sphere.setAttribute("position", "-5 0 0");
    sphere.setAttribute("radius", "0.2");
    sphere.setAttribute("class", "link");
    sphere.setAttribute("material", "shader: flat; color: gray;");
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
      tooltip.setAttribute("color", "black");
      tooltip.setAttribute("position", "0 0.3 0");
      tooltip.setAttribute("rotation", { x: 0, y: 90, z: 0 });
      tooltip.setAttribute("align", "center");
      tooltip.setAttribute("width", "4");
      tooltip.setAttribute("value", link.target);
      console.log("Affiché");
      sphere.appendChild(tooltip);
    });

    sphere.addEventListener("mouseleave", () => {
      sphere.innerHTML = "";
    });

    linkEntity.appendChild(sphere);
    $linksContainer.appendChild(linkEntity);
  });
}
