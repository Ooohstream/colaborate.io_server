const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

const users = [];
let projects = [
  {
    id: "cdf073ac-ca80-4d07-a50a-c93c51694989",
    name: "Project",
    description: "First project description",
    owner: "114372636289429844685",
    workers: [
      {
        email: "darkiwwwf@gmail.com",
        id: "114372636289429844685",
        name: "Styx",
      },
      {
        email: "darkiwwwf@gmail.com",
        id: "114372636289429844686",
        name: "John",
      },
    ],
    categories: [
      {
        id: "cdf073ac-ca80-4d07-a50a-c93c23594989",
        name: "Frontend",
        tasks: [
          {
            id: "cdf073ac-ca80-4d07-a50a-c93c23594989",
            name: "Design problem",
            description: "Design problem description ...",
            isDone: true,
            badgeColor: "#28a745",
            workers: [
              {
                email: "darkiwwwf@gmail.com",
                id: "114372636289429844686",
                name: "John",
              },
            ],
            deadline: {
              date: Date.now(),
              time: Date.now(),
            },
          },
        ],
      },
    ],
  },
  {
    id: "cdf073ac-ca80-4d07-a50a-c93c51694990",
    name: "Project2",
    owner: "114372636289429844686",
    workers: [
      {
        email: "darkiwwwf@gmail.com",
        id: "114372636289429844686",
        name: "John",
      },
    ],
    categories: [],
  },
];

/* Body middleware */

app
  .use(
    express.urlencoded({
      extended: true,
    })
  )
  .use(cors({ credentials: true, origin: "*" }));

app.use(express.json());

app.put("/task/set-done", (req, res) => {
  projects
    .find((project) => project.id === req.body.projectId)
    .categories.find((category) => category.id === req.body.categoryId)
    .tasks.find((task) => task.id === req.body.id).isDone = !projects
    .find((project) => project.id === req.body.projectId)
    .categories.find((category) => category.id === req.body.categoryId)
    .tasks.find((task) => task.id === req.body.id).isDone;
  res
    .status(201)
    .json(
      projects.find((project) => project.id === req.body.projectId).categories
    );
});

app.delete("/tasks/remove", (req, res) => {
  projects
    .find((project) => project.id === req.query.projectId)
    .categories.find((category) => category.id === req.query.categoryId).tasks =
    projects
      .find((project) => project.id === req.query.projectId)
      .categories.find((category) => category.id === req.query.categoryId)
      .tasks.filter((task) => task.id !== req.query.id);
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.query.projectId).categories
    );
});

app.post("/tasks/add", (req, res) => {
  projects
    .find((project) => project.id === req.body.projectId)
    ?.categories?.find((category) => category.id === req.body.categoryId)
    ?.tasks.push(req.body.task);
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.body.projectId)?.categories
    );
});

app.put("/tasks/edit", (req, res) => {
  projects = projects.map((project) =>
    project.id === req.body.projectId
      ? {
          ...project,
          categories: project.categories.map((category) =>
            category.id === req.body.categoryId
              ? {
                  ...category,
                  tasks: category.tasks.map((task) =>
                    task.id === req.body.task.id ? req.body.task : task
                  ),
                }
              : category
          ),
        }
      : project
  );
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.body.projectId).categories
    );
});

app.get("/task", (req, res) => {
  res.status(200).json(
    projects
      .find((project) => project.id === req.query.projectId)
      ?.categories.find((category) => category.id === req.query.categoryId)
      ?.tasks.find((task) => task.id === req.query.id)
  );
});

app.get("/project/workers", (req, res) => {
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.query.projectId).workers
    );
});

app.patch("/categories/edit", (req, res) => {
  projects
    .find((project) => project.id === req.body.projectId)
    .categories.find((category) => category.id === req.body.id).name =
    req.body.name;
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.body.projectId).categories
    );
});

app.delete("/categories/remove", (req, res) => {
  projects.find((project) => project.id === req.query.projectId).categories =
    projects
      .find((project) => project.id === req.query.projectId)
      .categories.filter((category) => category.id !== req.query.id);
  res
    .status(200)
    .json(
      projects.find((project) => project.id === req.query.projectId).categories
    );
});

app.post("/categories/add", (req, res) => {
  const categories = projects.find(
    (project) => project.id === req.body.projectId
  )?.categories;
  categories.push(req.body.category);
  res.status(200).json(categories);
});

app.get("/categories", (req, res) => {
  res
    .status(200)
    .json(projects.find((project) => project.id === req.query.id).categories);
});

app.patch("/projects/join", (req, res) => {
  const projectToJoin = projects.find((project) => project.id === req.body.id);
  if (!projectToJoin.workers.find((worker) => worker.id === req.body.user.id)) {
    projectToJoin.workers.push(req.body.user);
    res.status(201).json(projectToJoin);
  } else
    res.status(200).json({
      message: "You are already a member of this project!",
      alreadyMember: true,
    });
});

app.delete("/projects/remove", (req, res) => {});

app.post("/projects/add", (req, res) => {
  projects.push({ ...req.body, categories: [] });
  res.status(201).json(req.body);
});

app.get("/projects", (req, res) => {
  const usersProjects = projects.filter((project) =>
    project.workers.find((worker) => worker.id === req.query.id)
  );
  res.json({ projects: usersProjects });
});

app.get("/project", (req, res) => {
  res.status(200).json(projects.find((project) => project.id === req.query.id));
});

app.put("/projects/edit", (req, res) => {
  const project = projects.find((project) => project.id === req.body.id);
  project.name = req.body.name;
  project.description = req.body.description;
  res
    .status(200)
    .json(
      projects.filter((project) =>
        project.workers.find((worker) => worker.id === req.body.userId)
      )
    );
});

app.post("/authorization", (req, res) => {
  if (!users.find((user) => (user.id = req.body.id))) {
    users.push(req.body);
    console.log("New user authenticated!");
    res.json({ auth_status: "success" });
  }
  res.json({ auth_status: "success" });
});

app.get("/", (req, res) => {
  res.send("Main route");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
