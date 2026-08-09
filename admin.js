/* ==========================================
   ADMIN DASHBOARD
   NO SUPABASE
========================================== */


/* ==========================================
   🔐 CHANGE YOUR PASSWORD HERE
========================================== */

const ADMIN_PASSWORD = "12345678";


/* ==========================================
   STORAGE KEYS
========================================== */

const KEYS = {

  projects: "portfolio_projects",

  skills: "portfolio_skills",

  about: "portfolio_about",

  messages: "portfolio_messages",

  visitors: "portfolio_visitors",

  loggedIn: "portfolio_admin_login"

};


/* ==========================================
   DEFAULT DATA
========================================== */

const defaultProjects = [];

const defaultSkills = [
  {
    id: createId(),
    name: "HTML",
    percentage: 95
  },
  {
    id: createId(),
    name: "CSS",
    percentage: 90
  },
  {
    id: createId(),
    name: "JavaScript",
    percentage: 80
  },
  {
    id: createId(),
    name: "Node.js",
    percentage: 75
  },
  {
    id: createId(),
    name: "Git & GitHub",
    percentage: 80
  },
  {
    id: createId(),
    name: "Supabase",
    percentage: 70
  }
];


/* ==========================================
   HELPERS
========================================== */

function createId() {

  return Date.now() +
    Math.floor(
      Math.random() * 10000
    );

}


function getData(key, fallback = []) {

  try {

    const data =
      localStorage.getItem(key);

    if (!data) {

      return fallback;
    }

    return JSON.parse(data);

  } catch {

    return fallback;

  }

}


function saveData(key, data) {

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );

}


function escapeHTML(value) {

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ==========================================
   INITIAL DATA
========================================== */

function initializeData() {

  if (!localStorage.getItem(KEYS.projects)) {

    saveData(
      KEYS.projects,
      defaultProjects
    );

  }


  if (!localStorage.getItem(KEYS.skills)) {

    saveData(
      KEYS.skills,
      defaultSkills
    );

  }


  if (!localStorage.getItem(KEYS.about)) {

    saveData(
      KEYS.about,
      {
        title:
          "Hi, I'm Madusanka 👋",

        description:
          "I'm a Web Developer who loves creating modern and responsive websites.",

        image:
          ""
      }
    );

  }


  if (!localStorage.getItem(KEYS.messages)) {

    saveData(
      KEYS.messages,
      []
    );

  }


  if (!localStorage.getItem(KEYS.visitors)) {

    saveData(
      KEYS.visitors,
      {
        total: 0
      }
    );

  }

}


/* ==========================================
   LOGIN
========================================== */

function login() {

  const password =
    document
      .getElementById("password")
      .value;

  const error =
    document
      .getElementById("loginError");


  if (
    password ===
    ADMIN_PASSWORD
  ) {

    sessionStorage.setItem(
      KEYS.loggedIn,
      "true"
    );

    showDashboard();

  } else {

    error.textContent =
      "❌ Incorrect password";

  }

}


/* ==========================================
   SHOW DASHBOARD
========================================== */

function showDashboard() {

  document
    .getElementById("loginPage")
    .classList.add("hidden");

  document
    .getElementById("dashboard")
    .classList.remove("hidden");

  loadAll();

}


/* ==========================================
   LOGOUT
========================================== */

function logout() {

  sessionStorage.removeItem(
    KEYS.loggedIn
  );

  location.reload();

}


/* ==========================================
   NAVIGATION
========================================== */

function setupNavigation() {

  const buttons =
    document.querySelectorAll(
      ".menu-btn"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const section =
          button.dataset.section;

        buttons.forEach(btn => {

          btn.classList.remove(
            "active"
          );

        });

        button.classList.add(
          "active"
        );


        document
          .querySelectorAll(
            ".page-section"
          )
          .forEach(sectionEl => {

            sectionEl.classList.add(
              "hidden"
            );

          });


        const target =
          document.getElementById(
            section
          );

        if (target) {

          target.classList.remove(
            "hidden"
          );

        }


        const titles = {

          overview: [
            "Dashboard",
            "Welcome back 👋"
          ],

          projects: [
            "Projects",
            "Manage your projects"
          ],

          skills: [
            "Skills",
            "Manage your skills"
          ],

          about: [
            "About Me",
            "Edit your personal information"
          ],

          messages: [
            "Messages",
            "Your messages"
          ],

          settings: [
            "Settings",
            "Dashboard settings"
          ]

        };


        const title =
          titles[section];


        if (title) {

          document
            .getElementById(
              "pageTitle"
            )
            .textContent =
            title[0];

          document
            .getElementById(
              "pageSubtitle"
            )
            .textContent =
            title[1];

        }

      }

    );

  });

}


/* ==========================================
   LOAD ALL
========================================== */

function loadAll() {

  updateStats();

  renderProjects();

  renderSkills();

  loadAbout();

  renderMessages();

}


/* ==========================================
   STATS
========================================== */

function updateStats() {

  const projects =
    getData(
      KEYS.projects,
      []
    );

  const skills =
    getData(
      KEYS.skills,
      []
    );

  const messages =
    getData(
      KEYS.messages,
      []
    );

  const visitors =
    getData(
      KEYS.visitors,
      {
        total: 0
      }
    );


  document
    .getElementById(
      "totalVisitors"
    )
    .textContent =
    Number(
      visitors.total || 0
    ).toLocaleString();


  document
    .getElementById(
      "totalProjects"
    )
    .textContent =
    projects.length;


  document
    .getElementById(
      "totalSkills"
    )
    .textContent =
    skills.length;


  document
    .getElementById(
      "totalMessages"
    )
    .textContent =
    messages.length;

}


/* ==========================================
   PROJECTS
========================================== */

function renderProjects() {

  const projects =
    getData(
      KEYS.projects,
      []
    );

  const container =
    document.getElementById(
      "projectsList"
    );


  if (!projects.length) {

    container.innerHTML = `
      <div class="project-card">
        <h3>No Projects Yet</h3>
        <p>
          Click "Add Project" to create
          your first project.
        </p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    projects.map(project => {

      const image =
        project.image
          ? `
            <img
              class="project-image"
              src="${escapeHTML(project.image)}"
              alt=""
              onerror="this.style.display='none'"
            >
          `
          : "";


      return `

        <div class="project-card">

          ${image}

          <h3>
            ${escapeHTML(
              project.name
            )}
          </h3>

          <p>
            ${escapeHTML(
              project.description
            )}
          </p>

          <div class="card-actions">

            ${
              project.demo
              ? `
                <button
                  onclick="openURL('${encodeURI(project.demo)}')"
                >
                  🌐 Demo
                </button>
              `
              : ""
            }

            ${
              project.github
              ? `
                <button
                  onclick="openURL('${encodeURI(project.github)}')"
                >
                  💻 Code
                </button>
              `
              : ""
            }

            <button
              class="delete"
              onclick="deleteProject(${project.id})"
            >
              🗑️ Delete
            </button>

          </div>

        </div>

      `;

    }).join("");

}


/* ==========================================
   ADD PROJECT
========================================== */

function addProject() {

  const name =
    document
      .getElementById(
        "projectName"
      )
      .value
      .trim();

  const description =
    document
      .getElementById(
        "projectDescription"
      )
      .value
      .trim();

  const image =
    document
      .getElementById(
        "projectImage"
      )
      .value
      .trim();

  const demo =
    document
      .getElementById(
        "projectDemo"
      )
      .value
      .trim();

  const github =
    document
      .getElementById(
        "projectGithub"
      )
      .value
      .trim();


  if (!name) {

    alert(
      "Please enter project name."
    );

    return;

  }


  const projects =
    getData(
      KEYS.projects,
      []
    );


  projects.unshift({

    id: createId(),

    name,

    description,

    image,

    demo,

    github

  });


  saveData(
    KEYS.projects,
    projects
  );


  closeProjectModal();

  renderProjects();

  updateStats();

}


/* ==========================================
   DELETE PROJECT
========================================== */

function deleteProject(id) {

  if (
    !confirm(
      "Are you sure you want to delete this project?"
    )
  ) {

    return;

  }


  let projects =
    getData(
      KEYS.projects,
      []
    );


  projects =
    projects.filter(
      project =>
        project.id !== id
    );


  saveData(
    KEYS.projects,
    projects
  );


  renderProjects();

  updateStats();

}


/* ==========================================
   SKILLS
========================================== */

function renderSkills() {

  const skills =
    getData(
      KEYS.skills,
      []
    );


  const container =
    document.getElementById(
      "skillsList"
    );


  if (!skills.length) {

    container.innerHTML = `
      <div class="skill-card">
        <p>No skills added yet.</p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    skills.map(skill => `

      <div class="skill-card">

        <div class="skill-header">

          <strong>
            ${escapeHTML(
              skill.name
            )}
          </strong>

          <span class="skill-percent">
            ${skill.percentage}%
          </span>

        </div>

        <div class="progress">

          <div
            class="progress-bar"
            style="width:${skill.percentage}%"
          ></div>

        </div>

        <div class="card-actions">

          <button
            class="delete"
            onclick="deleteSkill(${skill.id})"
          >
            🗑️ Delete
          </button>

        </div>

      </div>

    `).join("");

}


/* ==========================================
   ADD SKILL
========================================== */

function addSkill() {

  const name =
    document
      .getElementById(
        "skillName"
      )
      .value
      .trim();

  const percentage =
    Number(
      document
        .getElementById(
          "skillPercentage"
        )
        .value
    );


  if (!name) {

    alert(
      "Please enter skill name."
    );

    return;

  }


  if (
    percentage < 0 ||
    percentage > 100 ||
    !Number.isFinite(percentage)
  ) {

    alert(
      "Percentage must be between 0 and 100."
    );

    return;

  }


  const skills =
    getData(
      KEYS.skills,
      []
    );


  skills.push({

    id: createId(),

    name,

    percentage

  });


  saveData(
    KEYS.skills,
    skills
  );


  closeSkillModal();

  renderSkills();

  updateStats();

}


/* ==========================================
   DELETE SKILL
========================================== */

function deleteSkill(id) {

  if (
    !confirm(
      "Delete this skill?"
    )
  ) {

    return;

  }


  let skills =
    getData(
      KEYS.skills,
      []
    );


  skills =
    skills.filter(
      skill =>
        skill.id !== id
    );


  saveData(
    KEYS.skills,
    skills
  );


  renderSkills();

  updateStats();

}


/* ==========================================
   ABOUT
========================================== */

function loadAbout() {

  const about =
    getData(
      KEYS.about,
      {}
    );


  document
    .getElementById(
      "aboutTitle"
    )
    .value =
    about.title || "";


  document
    .getElementById(
      "aboutDescription"
    )
    .value =
    about.description || "";


  document
    .getElementById(
      "profileImage"
    )
    .value =
    about.image || "";

}


function saveAbout() {

  const title =
    document
      .getElementById(
        "aboutTitle"
      )
      .value
      .trim();

  const description =
    document
      .getElementById(
        "aboutDescription"
      )
      .value
      .trim();

  const image =
    document
      .getElementById(
        "profileImage"
      )
      .value
      .trim();


  saveData(
    KEYS.about,
    {
      title,
      description,
      image
    }
  );


  alert(
    "✅ About Me saved!"
  );

}


/* ==========================================
   MESSAGES
========================================== */

function renderMessages() {

  const messages =
    getData(
      KEYS.messages,
      []
    );


  const container =
    document.getElementById(
      "messagesList"
    );


  if (!messages.length) {

    container.innerHTML = `
      <div class="message-card">
        <h3>No Messages</h3>
        <p>
          No contact messages have been
          saved yet.
        </p>
      </div>
    `;

    return;

  }


  container.innerHTML =
    messages.map(message => `

      <div class="message-card">

        <h3>
          ${escapeHTML(
            message.name
          )}
        </h3>

        <p>
          ${escapeHTML(
            message.email
          )}
        </p>

        <p>
          ${escapeHTML(
            message.message
          )}
        </p>

        <div class="card-actions">

          <button
            class="delete"
            onclick="deleteMessage(${message.id})"
          >
            🗑️ Delete
          </button>

        </div>

      </div>

    `).join("");

}


function deleteMessage(id) {

  let messages =
    getData(
      KEYS.messages,
      []
    );


  messages =
    messages.filter(
      message =>
        message.id !== id
    );


  saveData(
    KEYS.messages,
    messages
  );


  renderMessages();

  updateStats();

}


function clearMessages() {

  if (
    !confirm(
      "Delete ALL messages?"
    )
  ) {

    return;

  }


  saveData(
    KEYS.messages,
    []
  );


  renderMessages();

  updateStats();

}


/* ==========================================
   MODALS
========================================== */

function openProjectModal() {

  document
    .getElementById(
      "projectModal"
    )
    .classList.remove("hidden");

}


function closeProjectModal() {

  document
    .getElementById(
      "projectModal"
    )
    .classList.add("hidden");


  document
    .getElementById(
      "projectName"
    )
    .value = "";


  document
    .getElementById(
      "projectDescription"
    )
    .value = "";


  document
    .getElementById(
      "projectImage"
    )
    .value = "";


  document
    .getElementById(
      "projectDemo"
    )
    .value = "";


  document
    .getElementById(
      "projectGithub"
    )
    .value = "";

}


function openSkillModal() {

  document
    .getElementById(
      "skillModal"
    )
    .classList.remove("hidden");

}


function closeSkillModal() {

  document
    .getElementById(
      "skillModal"
    )
    .classList.add("hidden");


  document
    .getElementById(
      "skillName"
    )
    .value = "";


  document
    .getElementById(
      "skillPercentage"
    )
    .value = "";

}


/* ==========================================
   OPEN URL
========================================== */

function openURL(url) {

  if (!url) return;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* ==========================================
   RESET
========================================== */

function resetDashboard() {

  if (
    !confirm(
      "⚠️ This will delete all dashboard data. Continue?"
    )
  ) {

    return;

  }


  Object.values(KEYS)
    .forEach(key => {

      if (
        key !== KEYS.loggedIn
      ) {

        localStorage.removeItem(
          key
        );

      }

    });


  initializeData();

  loadAll();

  alert(
    "Dashboard reset successfully."
  );

}


/* ==========================================
   VISITOR DEMO COUNTER
========================================== */

function updateVisitorDemo() {

  const visitors =
    getData(
      KEYS.visitors,
      {
        total: 0
      }
    );


  /*
    This increments once per
    browser session.
  */

  if (
    !sessionStorage.getItem(
      "visitor_counted"
    )
  ) {

    visitors.total =
      Number(
        visitors.total || 0
      ) + 1;


    saveData(
      KEYS.visitors,
      visitors
    );


    sessionStorage.setItem(
      "visitor_counted",
      "true"
    );

  }

}


/* ==========================================
   PASSWORD SHOW / HIDE
========================================== */

function setupPasswordToggle() {

  const button =
    document.getElementById(
      "showPassword"
    );


  button.addEventListener(
    "click",
    () => {

      const input =
        document.getElementById(
          "password"
        );


      if (
        input.type ===
        "password"
      ) {

        input.type = "text";

        button.textContent =
          "🙈";

      } else {

        input.type = "password";

        button.textContent =
          "👁️";

      }

    }
  );

}


/* ==========================================
   ENTER KEY LOGIN
========================================== */

function setupLogin() {

  document
    .getElementById(
      "loginBtn"
    )
    .addEventListener(
      "click",
      login
    );


  document
    .getElementById(
      "password"
    )
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          login();

        }

      }
    );

}


/* ==========================================
   SETUP BUTTONS
========================================== */

function setupButtons() {

  document
    .getElementById(
      "logoutBtn"
    )
    .addEventListener(
      "click",
      logout
    );


  document
    .getElementById(
      "addProjectBtn"
    )
    .addEventListener(
      "click",
      openProjectModal
    );


  document
    .getElementById(
      "closeProjectModal"
    )
    .addEventListener(
      "click",
      closeProjectModal
    );


  document
    .getElementById(
      "saveProjectBtn"
    )
    .addEventListener(
      "click",
      addProject
    );


  document
    .getElementById(
      "addSkillBtn"
    )
    .addEventListener(
      "click",
      openSkillModal
    );


  document
    .getElementById(
      "closeSkillModal"
    )
    .addEventListener(
      "click",
      closeSkillModal
    );


  document
    .getElementById(
      "saveSkillBtn"
    )
    .addEventListener(
      "click",
      addSkill
    );


  document
    .getElementById(
      "saveAboutBtn"
    )
    .addEventListener(
      "click",
      saveAbout
    );


  document
    .getElementById(
      "clearMessagesBtn"
    )
    .addEventListener(
      "click",
      clearMessages
    );


  document
    .getElementById(
      "resetBtn"
    )
    .addEventListener(
      "click",
      resetDashboard
    );


  document
    .getElementById(
      "websiteBtn"
    )
    .addEventListener(
      "click",
      () => {

        window.location.href =
          "index.html";

      }
    );

}


/* ==========================================
   START
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeData();

    updateVisitorDemo();

    setupLogin();

    setupPasswordToggle();

    setupNavigation();

    setupButtons();


    /*
      If already logged in
      during this browser session
    */

    if (
      sessionStorage.getItem(
        KEYS.loggedIn
      ) === "true"
    ) {

      showDashboard();

    }

  }
);
