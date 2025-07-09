'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

import { auth } from '@/lib/firebase/client';
import { handleErrors } from '@/lib/utils/error';
import { createProfile } from '@/lib/utils/user';
import { useForm } from '@/hooks/useForm';
import { UserRegisterSchema } from '@/schema/UserSchema';
import { strings } from '@/constants/strings';

import mailIcon from '@/../public/icons/mail.svg';
import passwordIcon from '@/../public/icons/password.svg';
import userIcon from '@/../public/icons/user.svg';

export default function RegisterPage() {
  const router = useRouter();
  const { formState, setFormState, handleInputChange, hasErrors } = useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onRegisterAsync = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { displayName, email, password } = UserRegisterSchema.parse({
        displayName: formState.displayName?.value ?? '',
        email: formState.email?.value ?? '',
        password: formState.password?.value ?? '',
        confirmPassword: formState.confirmPassword?.value ?? '',
      });

      const { user } = (await createUserWithEmailAndPassword(auth, email, password)) as UserCredential;

      await createProfile(displayName, email, user.uid);
      router.push('/');
    } catch (err) {
      handleErrors(err, strings.auth.errors.registerFail, setFormState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Input
        name="displayName"
        type="text"
        placeholder={strings.auth.displayNamePlaceholder}
        onChange={handleInputChange(UserRegisterSchema._def.schema.shape.displayName)}
        input={formState.displayName}
        iconNode={userIcon}
      />
      <Input
        name="email"
        type="email"
        placeholder={strings.auth.emailPlaceholder}
        onChange={handleInputChange(UserRegisterSchema._def.schema.shape.email)}
        input={formState.email}
        iconNode={mailIcon}
      />
      <Input
        name="password"
        type="password"
        placeholder={strings.auth.passwordPlaceholder}
        onChange={handleInputChange(UserRegisterSchema._def.schema.shape.password)}
        input={formState.password}
        iconNode={passwordIcon}
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder={strings.auth.confirmPasswordPlaceholder}
        onChange={handleInputChange(UserRegisterSchema._def.schema.shape.confirmPassword)}
        input={formState.confirmPassword}
        iconNode={passwordIcon}
      />
      <Button
        themeColor="green"
        type="submit"
        onClick={onRegisterAsync}
        disabled={hasErrors || loading}
        isLoading={loading}
      >
        register
      </Button>
    </>
  );
}
