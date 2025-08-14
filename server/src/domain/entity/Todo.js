import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({
    todoID = uuidv4(), // Internal ID (UUID) and external API ID
    title,
    description = null,
    dueDate = null,
    priority = null,
    status = null,
    completionNotes = null,
    actualCompletionDate = null,
    timeSpentMinutes = null,
    satisfactionRating = null,
    reopenReason = null,
    priorityAdjustment = null,
    estimatedEffortHours = null,
    deletionReason = null,
    deletionComment = null,
    confirmDeletion = null,
    retainForDays = null
  }) {
    if (!title) {
      throw new Error('Title is required');
    }

    this.id = todoID; // Internal primary key, consistent with uuid generation
    this.todoID = todoID; // External API field name for the ID

    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.completionNotes = completionNotes;
    this.actualCompletionDate = actualCompletionDate;
    this.timeSpentMinutes = timeSpentMinutes;
    this.satisfactionRating = satisfactionRating;
    this.reopenReason = reopenReason;
    this.priorityAdjustment = priorityAdjustment;
    this.estimatedEffortHours = estimatedEffortHours;
    this.deletionReason = deletionReason;
    this.deletionComment = deletionComment;
    this.confirmDeletion = confirmDeletion;
    this.retainForDays = retainForDays;
  }

  toJSON() {
    return {
      id: this.id, // Expose internal UUID
      todoID: this.todoID, // Expose API field name for ID
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      status: this.status,
      completionNotes: this.completionNotes,
      actualCompletionDate: this.actualCompletionDate,
      timeSpentMinutes: this.timeSpentMinutes,
      satisfactionRating: this.satisfactionRating,
      reopenReason: this.reopenReason,
      priorityAdjustment: this.priorityAdjustment,
      estimatedEffortHours: this.estimatedEffortHours,
      deletionReason: this.deletionReason,
      deletionComment: this.deletionComment,
      confirmDeletion: this.confirmDeletion,
      retainForDays: this.retainForDays
    };
  }
}

export default Todo;