import { SceneContext, SceneSession } from 'telegraf/typings/scenes';

export interface ExercisesSession extends SceneSession {
  exerciseTypeId?: number;
  bodyPartId?: number;
}

export interface ExercisesSceneContext extends SceneContext {
  session: ExercisesSession;
}

export interface GymSession extends SceneSession {
  programId: number;
  dayId: number;
  stageId: number;
  exerciseId: number;
  stages: number[];
  exercises: number[];
}

export interface GymSceneContext extends SceneContext {
  session: GymSession;
}
