import mongoose from "mongoose";

const { Schema, model } = mongoose;

const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true, // Supabase user ID (OWNER)
      index: true,
    },

    code: {
      type: String,
      default: "",
    },

    template: {
      id: { type: Number, default: "1.0.0" },
      name: { type: String, default: "custom" },
      alias: { type: String, default: "txt" },
      boilerplate: { type: String, default: "" },
    },

    /* ===============================
       LAST UPDATED BY (NEW)
       =============================== */
    lastUpdatedBy: {
      userId: {
        type: String, // Supabase user ID
      },
      userName: {
        type: String, // Name or email
      },
    },
  },
  {
    timestamps: true,
    collection: "Project",
  }
);

export const Project = model("Project", projectSchema);
