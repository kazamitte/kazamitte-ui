import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from '../../components/FileUpload';

const hiddenInput = (): HTMLInputElement => {
  const input = document.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) throw new Error('no file input');
  return input;
};

const textFile = (name: string, size = 4): File =>
  new File(['a'.repeat(size)], name, { type: 'text/plain' });

describe('FileUpload', () => {
  it('labels the hidden file input, with a trigger named ファイルを選択 and a dropzone', () => {
    render(<FileUpload label="添付ファイル" />);
    expect(
      screen.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeInTheDocument();
    expect(screen.getByText('ここにファイルをドロップ')).toBeInTheDocument();
    const input = screen.getByLabelText('添付ファイル');
    expect(input).toBe(hiddenInput());
    expect(input).toHaveAttribute('type', 'file');
    expect(
      screen.getByLabelText('ファイルをここにドロップするか、選択してください'),
    ).toBeInTheDocument();
  });

  it('shows custom dropzone text in place of the default', () => {
    render(<FileUpload label="添付" dropzoneText="画像をここへ" />);
    expect(screen.getByText('画像をここへ')).toBeInTheDocument();
    expect(
      screen.queryByText('ここにファイルをドロップ'),
    ).not.toBeInTheDocument();
  });

  it('shows only the trigger without the dropzone', () => {
    render(<FileUpload label="添付ファイル" dropzone={false} />);
    expect(
      screen.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('ここにファイルをドロップ'),
    ).not.toBeInTheDocument();
  });

  it('lists an accepted file with its name and a delete button named after it', async () => {
    const user = userEvent.setup();
    const onFileAccept = vi.fn();
    render(<FileUpload label="添付ファイル" onFileAccept={onFileAccept} />);
    const file = textFile('report.txt');
    await user.upload(hiddenInput(), file);

    expect(await screen.findByText('report.txt')).toBeInTheDocument();
    expect(onFileAccept).toHaveBeenCalledWith({ files: [file] });
    const remove = screen.getByRole('button', { name: 'report.txtを削除' });
    await user.click(remove);
    await waitFor(() =>
      expect(screen.queryByText('report.txt')).not.toBeInTheDocument(),
    );
  });

  it('explains a rejected file in Japanese and reports it', async () => {
    const user = userEvent.setup();
    const onFileReject = vi.fn();
    render(
      <FileUpload
        label="添付ファイル"
        maxFiles={2}
        onFileReject={onFileReject}
      />,
    );
    await user.upload(hiddenInput(), [
      textFile('one.txt'),
      textFile('two.txt'),
      textFile('three.txt'),
    ]);

    expect(
      await screen.findByText('追加できなかったファイルがあります'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('three.txt: ファイル数が上限を超えています'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /を削除$/ }),
    ).not.toBeInTheDocument();
    const { files } = onFileReject.mock.lastCall?.[0] as {
      files: { errors: string[] }[];
    };
    expect(files).toHaveLength(3);
    expect(files[0]?.errors).toEqual(['TOO_MANY_FILES']);
  });

  it('passes accept through to the hidden input', () => {
    render(<FileUpload accept="image/png" />);
    expect(hiddenInput()).toHaveAttribute('accept', 'image/png');
  });

  it('disables the trigger and the input when disabled', () => {
    render(<FileUpload label="添付ファイル" disabled />);
    expect(
      screen.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeDisabled();
    expect(hiddenInput()).toBeDisabled();
  });

  it('offers すべて削除 only for several files and clears them all', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="添付ファイル" maxFiles={3} />);
    await user.upload(hiddenInput(), textFile('one.txt'));
    await screen.findByText('one.txt');
    expect(
      screen.queryByRole('button', { name: 'すべて削除' }),
    ).not.toBeInTheDocument();

    await user.upload(hiddenInput(), textFile('two.txt'));
    await user.click(await screen.findByRole('button', { name: 'すべて削除' }));
    await waitFor(() => {
      expect(screen.queryByText('one.txt')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('two.txt')).not.toBeInTheDocument();
  });

  it('lets a translations override rename the delete button and keeps the other defaults', async () => {
    const user = userEvent.setup();
    render(
      <FileUpload
        label="添付ファイル"
        translations={{ deleteFile: (file) => `Remove ${file.name}` }}
      />,
    );
    await user.upload(hiddenInput(), textFile('report.txt'));
    expect(
      await screen.findByRole('button', { name: 'Remove report.txt' }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('ファイルをここにドロップするか、選択してください'),
    ).toBeInTheDocument();
  });

  it('previews an image file as an image', async () => {
    const user = userEvent.setup();
    const create: unknown = Reflect.get(URL, 'createObjectURL');
    const revoke: unknown = Reflect.get(URL, 'revokeObjectURL');
    URL.createObjectURL = vi.fn(() => 'blob:preview');
    URL.revokeObjectURL = vi.fn();
    try {
      render(<FileUpload label="添付ファイル" accept="image/*" />);
      await user.upload(
        hiddenInput(),
        new File(['x'], 'photo.png', { type: 'image/png' }),
      );
      expect(await screen.findByText('photo.png')).toBeInTheDocument();
      expect(await screen.findByRole('img')).toHaveAttribute(
        'src',
        'blob:preview',
      );
    } finally {
      Reflect.set(URL, 'createObjectURL', create);
      Reflect.set(URL, 'revokeObjectURL', revoke);
    }
  });
});
