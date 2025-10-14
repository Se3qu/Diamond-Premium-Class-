import ContentArea from "./ContentArea";
import { useProjects } from "../context/ProjectContext";

export default function DashboardView() {
  const { selectedProject } = useProjects();

  if (!selectedProject) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Soldan bir proje seçiniz.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <ContentArea />
    </div>
  );
}
