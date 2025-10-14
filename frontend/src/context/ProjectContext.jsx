import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const [blocks, setBlocks] = useState([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [blocksError, setBlocksError] = useState(null);

  // 1) Projeleri çek
  useEffect(() => {
    let mounted = true;
    (async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        // trailing slash ile çağır: /projects/
        const res = await axios.get(`${API_BASE}/projects/`);
        const list = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;
        setProjects(list);

        // hiç seçim yoksa ilk projeyi otomatik seç
        if (!selectedProject && list.length > 0) {
          setSelectedProject(list[0]);
        }
      } catch (err) {
        if (!mounted) return;
        setProjectsError(err?.message || "Projeler alınamadı");
      } finally {
        if (!mounted) return;
        setProjectsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [API_BASE]);

  // 2) Seçilen projeye göre blokları çek (KALICI: dinamik project.code)
  useEffect(() => {
    let mounted = true;

    async function ensureProjectCode(p) {
      // bazı eski yanıtlarda code dönmeyebilir; gerekirse id ile detay çek
      if (p?.code) return p;
      try {
        const res = await axios.get(`${API_BASE}/projects/${p.id}`);
        return res.data?.code ? res.data : { ...p, code: (p.name || "").slice(0,3).toUpperCase() };
      } catch {
        // son çare: isimden 3 harf üret
        return { ...p, code: (p?.name || "").slice(0,3).toUpperCase() };
      }
    }

    (async () => {
      setBlocks([]);
      setBlocksError(null);

      if (!selectedProject) return;
      setBlocksLoading(true);
      try {
        const projWithCode = await ensureProjectCode(selectedProject);
        const code = projWithCode.code;

        // asla sabit (DIA/DPL2025) yazma — her zaman seçilen projenin code’una göre çağır
        const res = await axios.get(`${API_BASE}/blocks/project/${code}`);
        if (!mounted) return;
        setBlocks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!mounted) return;
        setBlocksError(err?.message || "Bloklar alınamadı");
      } finally {
        if (!mounted) return;
        setBlocksLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [API_BASE, selectedProject]);

  const value = useMemo(() => ({
    projects,
    projectsLoading,
    projectsError,

    selectedProject,
    setSelectedProject,

    blocks,
    blocksLoading,
    blocksError,
  }), [
    projects, projectsLoading, projectsError,
    selectedProject,
    blocks, blocksLoading, blocksError
  ]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
  return ctx;
}
