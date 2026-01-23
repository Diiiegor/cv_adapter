from pydantic import BaseModel


class CVValidatorOutput(BaseModel):
    is_curriculum: bool
