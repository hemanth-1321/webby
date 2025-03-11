export interface Step {
  id: number;
  title: number;
  description: string;
  type: StepType;
  status: "pending" | "in-progress" | "completed";
  code?: string;
}

export enum StepType {
  CreateFile,
  CreateFolder,
  EditFile,
  DeleteFile,
  RunScript,
}
