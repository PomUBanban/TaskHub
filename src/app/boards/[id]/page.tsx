"use client";
//@ts-ignore
import Board from "react-trello";

import { useEffect, useState } from "react";

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
  const [taskGroupId, setTaskGroupId] = useState(0);
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

  return (
    <div>
      <div className="flex w-[20%]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Creer une liste"
          className="text-black"
        />
        <button
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
          Creer
        </button>
      </div>
      <div className="flex w-[20%]">
        <input
          value={tasksName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Creer une tache"
          className="text-black"
        />
        <input
          value={taskGroupId}
          type={"number"}
          onChange={(e) => setTaskGroupId(e.target.value)}
          placeholder="ID du groupe de tache"
          className="text-black"
        />
        <button
          onClick={() => {
            fetch("/api/boards/" + params.id + "/tasksgroup/task", {
              method: "POST",
              body: JSON.stringify({ name: tasksName, taskGroupId }),
            }).then(() => {
              setUpdate(true);
              setTaskGroupId(0);
              setTaskName("");
            });
          }}
        >
          Creer
        </button>
      </div>
      <Board data={data} />
    </div>
  );
};

export default Page;
