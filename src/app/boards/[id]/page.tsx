"use client";
//@ts-ignore
import Board from "react-trello";

import { use, useEffect, useState } from "react";

type Task = {
  id: number;
  name: string;
  description: string;
};

type TaskGroups = {
  id: number;
  board_id: number;
  name: string;
  Tasks: Task[];
};

const Page = ({ params }: { params: { id: string } }) => {
  const [tasksGroup, setTasksGroup] = useState([]);
  const [data, setData] = useState({ lanes: [] });
  const [update, setUpdate] = useState(true);
  const [name, setName] = useState("");
  const [tasksName, setTaskName] = useState("");
  const [taskGroupId, setTaskGroupId] = useState("0");
  useEffect(() => {
    if (!update) return;
    fetch("/api/boards/" + params.id + "/tasksgroup", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setTasksGroup(JSON.parse(data));
        setUpdate(false);
      });
  }, [update]);
  useEffect(() => {
    setData({
      lanes: tasksGroup.map((group: TaskGroups) => {
        return {
          id: group.id,
          title: group.name,
          label: `ID: ${group.id}`,
          cards: group.Tasks.map((task) => {
            return {
              id: task.id,
              title: task.name,
              description: task.description,
            };
          }),
        };
      }) as any,
    });

    // Add a "add task" button to every lane after 1s
    setTimeout(() => {
      const lanes = document.querySelectorAll(".react-trello-lane");

      lanes.forEach((lane) => {
        if (lane.querySelector(".add-task-form")) {
          return;
        }

        const form = document.createElement("div");
        form.className = "add-task-form";
        form.innerHTML = `
          <input type="text" placeholder="Create a task" />
          <button>Create</button>
        `;

        const button = form.querySelector("button");
        const input = form.querySelector("input");

        button?.addEventListener("click", () => {
          const taaskGroupId = lane.getAttribute("label")?.split(":")[1].trim();
          fetch("/api/boards/" + params.id + "/tasksgroup/task", {
            method: "POST",
            body: JSON.stringify({
              name: input?.value,
              taskGroupId: taaskGroupId,
            }),
          }).then(() => {
            setUpdate(true);
            input.value = "";
          });
        });

        lane.appendChild(form);
      });
    }, 1000);
  }, [tasksGroup]);

  // Update Task when moved to another group
  const handleDragEnd = (
    cardId: string,
    sourceLaneId: string,
    targetLaneId: string,
  ) => {
    fetch("/api/boards/" + params.id + "/tasksgroup/task/" + cardId, {
      method: "PUT",
      body: JSON.stringify({ taskGroupId: targetLaneId }),
    }).then(() => {
      setUpdate(true);
    });
  };

  const handleCardDelete = (cardId: string, laneId: string) => {
    fetch("/api/boards/" + params.id + "/tasksgroup/task/" + cardId, {
      method: "DELETE",
    }).then(() => {
      setUpdate(true);
    });
  };

  return (
    <div>
      <div className="flex">
        <Board
          data={data}
          handleDragEnd={handleDragEnd}
          onCardDelete={handleCardDelete}
        />
        <div className="flex">
          <div className="flex flex-col align-center">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Creer une liste"
              className="text-black"
            />
            <div className="flex items-center justify-center">
              <button
                className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full cursor-pointer"
                onClick={() => {
                  fetch("/api/boards/" + params.id + "/tasksgroup", {
                    method: "POST",
                    body: JSON.stringify({ name }),
                  }).then(() => {
                    setUpdate(true);
                    setName("");
                  });
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
