"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Explore() {
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    const parsed = stored ? JSON.parse(stored) : [];

    const unique = parsed.filter(
      (project: any, index: number, self: any[]) =>
        index === self.findIndex((p) => p.id === project.id)
    );

    setProjects(unique);
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex bg-white">

      <div className="w-64 bg-gradient-to-b from-[#60B5FF] to-[#4AA3F0] text-white p-6 flex flex-col gap-6">

        <h2 className="text-2xl font-bold">Menu</h2>

        <div className="flex flex-col gap-3">

          <button
            onClick={() => router.push("/dashboard")}
            className="text-left px-4 py-2 rounded-lg hover:bg-white/20 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => router.push("/explore")}
            className="text-left px-4 py-2 rounded-lg bg-white/20"
          >
            Explorar Projetos
          </button>

        </div>
      </div>

      <div className="flex-1 p-10 overflow-y-auto">

        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          Explorar Projetos
        </h1>

        <input
          type="text"
          placeholder="Buscar projetos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 p-3 rounded-xl border border-slate-300 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#60B5FF]"
        />

        <div className="grid grid-cols-3 gap-6">

          {filteredProjects.length === 0 ? (
            <p className="text-slate-500">
              Nenhum projeto encontrado.
            </p>
          ) : (
            filteredProjects.map((project, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
              >

                {project.image && (
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                  ></div>
                )}

                <div className="p-4 flex flex-col gap-2">

                  <p className="text-lg font-bold text-slate-800">
                    {project.title}
                  </p>

                  <p className="text-sm text-slate-500">
                    {project.description}
                  </p>

                  <p className="text-xs text-slate-400">
                    Área: {project.area || "Não informada"}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    👤 {project.contributors || "Autor não informado"}
                  </p>

                  <div className="flex justify-between items-center mt-3">

                    <span className="text-[#60B5FF] font-bold">
                      {project.score}
                    </span>

                    <button className="text-red-500 text-xl">
                      ❤️
                    </button>

                  </div>

                </div>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
}