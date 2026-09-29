import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import styles from "./Settings.module.css";
import Field from "./Field";
import Button from "../../components/UI Kit/Button";
import { useToast } from "../../context/ToastContext";
import { removeProfilePicture, updateProfile, updateProfilePicture } from "../../mock/api";
import { resizeImage } from "../../utils/image";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const BIO_LIMIT = 150;

export default function EditProfile() {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const photoInput = useRef();

  const username = sessionStorage.getItem('username');

  // what is saved, and what is being typed
  const [saved, setSaved] = useState({
    name: sessionStorage.getItem('name') ?? '',
    username,
    bio: sessionStorage.getItem('bio') ?? '',
    email: sessionStorage.getItem('email') ?? '',
  });
  const [form, setForm] = useState(saved);
  const [errors, setErrors] = useState({});
  const [picture, setPicture] = useState(sessionStorage.getItem('picture'));

  const dirty = Object.keys(saved).some((key) => saved[key] !== form[key]);

  const change = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const saveMutation = useMutation({
    mutationFn: () => updateProfile(saved.username, form),
    onSuccess: (data) => {
      if (!data.success) {
        setErrors(data.errors ?? {});
        return;
      }

      sessionStorage.setItem('username', data.username);
      sessionStorage.setItem('name', data.name);
      sessionStorage.setItem('bio', data.bio);
      sessionStorage.setItem('email', data.email);

      const next = { name: data.name, username: data.username, bio: data.bio, email: data.email };
      setSaved(next);
      setForm(next);
      setErrors({});
      queryClient.invalidateQueries();
      showToast('Profile saved');
    },
    onError: () => showToast('Could not save your profile. Please try again.'),
  });

  const photoMutation = useMutation({
    // shrunk first: profile photos are stored in the browser, which has limited room
    mutationFn: async (file) => updateProfilePicture(saved.username, await resizeImage(file, 400)),
    onSuccess: (dataUrl) => {
      sessionStorage.setItem('picture', dataUrl);
      setPicture(dataUrl);
      queryClient.invalidateQueries();
      showToast('Profile photo updated');
    },
    onError: () => showToast('Could not upload that photo.'),
  });

  const removePhotoMutation = useMutation({
    mutationFn: () => removeProfilePicture(saved.username),
    onSuccess: () => {
      sessionStorage.removeItem('picture');
      setPicture(null);
      queryClient.invalidateQueries();
      showToast('Profile photo removed');
    },
  });

  const photoChosen = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      showToast('Choose a photo under 10 MB.');
      return;
    }
    photoMutation.mutate(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (dirty && !saveMutation.isPending) saveMutation.mutate();
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Edit profile</h2>

      <div className={styles.identity}>
        <div className={styles.avatar}>
          {picture ? <img alt="Your profile" src={picture} /> : saved.username.charAt(0).toUpperCase()}
        </div>
        <div className={styles.identityText}>
          <div className={styles.identityName}>{saved.username}</div>
          <div className={styles.identityActions}>
            <Button size="sm" onClick={() => photoInput.current.click()} disabled={photoMutation.isPending}>
              {photoMutation.isPending ? 'Uploading...' : 'Change photo'}
            </Button>
            {picture && (
              <Button size="sm" variant="ghost" onClick={() => removePhotoMutation.mutate()} disabled={removePhotoMutation.isPending}>
                Remove
              </Button>
            )}
          </div>
          <input ref={photoInput} type="file" accept="image/*" className={styles.hiddenInput} onChange={photoChosen} tabIndex={-1} aria-label="Choose a profile photo" />
        </div>
      </div>

      <form className={styles.form} onSubmit={submit} noValidate>
        <Field
          label="Name"
          value={form.name}
          onChange={change('name')}
          error={errors.name}
          autoComplete="name"
        />

        <Field
          label="Username"
          value={form.username}
          onChange={change('username')}
          error={errors.username}
          hint="Letters, numbers, periods and underscores."
          autoComplete="username"
          autoCapitalize="none"
        />

        <Field
          label="Bio"
          multiline
          value={form.bio}
          onChange={change('bio')}
          error={errors.bio}
          maxLength={BIO_LIMIT + 20}
          counter={<span className={styles.counter}>{form.bio.length}/{BIO_LIMIT}</span>}
        />

        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={change('email')}
          error={errors.email}
          hint="Only you can see this."
          autoComplete="email"
        />

        <div className={styles.actions}>
          <Button type="submit" variant="primary" disabled={!dirty || saveMutation.isPending}>
            {saveMutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
          {dirty && !saveMutation.isPending && (
            <Button type="button" variant="ghost" onClick={() => { setForm(saved); setErrors({}); }}>
              Discard
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
