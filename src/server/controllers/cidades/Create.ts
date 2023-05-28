import { Request, Response } from 'express';
import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';

interface ICidade {
  nome: string;
  estado: string;
}

const bodyValidationSchema: yup.Schema<ICidade> = yup.object().shape({
  nome: yup.string().required().min(3),
  estado: yup.string().required().length(2),
});

export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
  let validatedData: ICidade = req.body;
  try {
    validatedData = await bodyValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    return res.status(StatusCodes.CREATED).json(validatedData);
  } catch (error) {
    const yupError = error as yup.ValidationError;
    const errors: Record<string, string> = {};

    yupError.inner.forEach((error) => {
      if (!error.path) return;
      errors[error.path] = error.message;
    });

    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: errors,
    });
  }
};
