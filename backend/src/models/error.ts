export class UnauthorizedError extends Error {
  constructor() {
    super("Invalid Token");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Requires Token to Access");
    this.name = "ForbiddenError";
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
