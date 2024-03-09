import { SceneContext, SceneSession } from 'telegraf/typings/scenes';

export interface ExercisesSession extends SceneSession {
  exerciseTypeId?: number;
  bodyPartId?: number;
}

export interface ExercisesSceneContext extends SceneContext {
  session: ExercisesSession;
}
