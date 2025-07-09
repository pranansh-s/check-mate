export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized Route");
    this.name = "UnauthorizedError";
  }
}

export class DatabaseError extends Error {
  constructor() {
    super("Database Operation Failed");
    this.name = "DatabaseError";
  }
}

export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServiceError";
  }
}
