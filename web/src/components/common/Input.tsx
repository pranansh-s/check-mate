'use client';

import { InputHTMLAttributes } from 'react';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

import { IInputValue } from '@/types';
import tw from 'tailwind-styled-components';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLButtonElement>;

  iconNode?: StaticImport;
  input?: IInputValue;
}

const Input: React.FC<InputProps> = ({ iconNode, name, type, placeholder, onChange, input }) => {
  return (
    <InputContainer>
      <InputField $isError={input?.error}>
        {iconNode && <Image src={iconNode} alt={`input-${name}`} />}
        <StyledInput name={name} type={type} placeholder={placeholder} value={input?.value ?? ''} onChange={onChange} />
      </InputField>
      {input?.error && <ErrorText>*&nbsp;{input.error}</ErrorText>}
    </InputContainer>
  );
};

export default Input;

const InputContainer = tw.div`
  flex
  flex-col
  gap-1
`;

const InputField = tw.div<{
  $isError: boolean;
}>`
  flex
  gap-3
  rounded-lg
  border
  px-3
  ${p => (p.$isError ? 'border-red-500' : 'border-tertiary')}
  font-serif
  text-tertiary
  backdrop-brightness-[1.3]
`;

const StyledInput = tw.input`
  flex-grow
  bg-transparent
  py-4
  placeholder:text-tertiary
  placeholder:opacity-50
  focus:outline-none
`;

const ErrorText = tw.span`
  p-1
  font-serif
  text-xs
  font-medium
  lowercase
  text-red-500/75
`;
