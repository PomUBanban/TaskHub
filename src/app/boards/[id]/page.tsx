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

  return (
    <div>
      <div className="flex w-[20%]">
        <input
          value={tasksName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Creer une tache"
          className="text-black"
        />
        <select
          value={taskGroupId}
          onChange={(e) => setTaskGroupId(parseInt(e.target.value))}
        >
          <option value={0}>Select Task Group</option>
          {tasksGroup.map((group: TaskGroups) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            fetch("/api/boards/" + params.id + "/tasksgroup/task", {
              method: "POST",
              body: JSON.stringify({ name: tasksName, taskGroupId }),
            }).then(() => {
              setUpdate(true);
              setTaskGroupId("0");
              setTaskName("");
            });
          }}
        >
          Creer
        </button>
      </div>
      {/*  Row */}
      <div className="flex">
        <Board data={data} handleDragEnd={handleDragEnd} />
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
