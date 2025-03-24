import { useActionState } from "react";
import useOpinions from "../store/opinions/useOpinions";

import Submit from "./Submit";

const initialState = {
  errors: null,
  enteredValues: { userName: "", title: "", body: "" },
};

export function NewOpinion() {
  const [formState, formAction] = useActionState(
    shareOpinionAction,
    initialState
  );

  const { addOpinion } = useOpinions();

  async function shareOpinionAction(
    state: { errors: string[] | null },
    formData: FormData
  ) {
    const userName = formData.get("user-name") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    const enteredValues = { userName, title, body };

    console.log(enteredValues);

    const errors: string[] = [];

    if (!userName.trim()) errors.push("Please provide your name.");
    if (title.trim().length < 5) {
      errors.push("Title must be at least five characters long.");
    }
    if (body.trim().length < 10 || body.trim().length > 300) {
      errors.push("Opinion must be between 10 and 300 characters long.");
    }

    if (errors.length > 0) {
      return { errors, enteredValues };
    }

    await addOpinion(enteredValues);

    return initialState;
  }

  return (
    <div id="new-opinion">
      <h2>Share your opinion!</h2>
      <form action={formAction}>
        <div className="control-row">
          <p className="control">
            <label htmlFor="user-name">Your Name</label>
            <input
              type="text"
              id="user-name"
              name="user-name"
              defaultValue={formState.enteredValues?.userName}
            />
          </p>

          <p className="control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={formState.enteredValues?.title}
            />
          </p>
        </div>
        <p className="control">
          <label htmlFor="body">Your Opinion</label>
          <textarea
            id="body"
            name="body"
            rows={5}
            defaultValue={formState.enteredValues?.body}
          ></textarea>
        </p>

        {formState.errors && (
          <ul className="errors">
            {formState.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}

        <Submit />
      </form>
    </div>
  );
}
