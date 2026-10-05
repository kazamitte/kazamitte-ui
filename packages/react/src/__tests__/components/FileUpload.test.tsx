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
  it('renders a labelled dropzone with a trigger named ファイルを選択 over a hidden file input', () => {
    render(<FileUpload label="添付ファイル" />);
    expect(
      screen.getByRole('button', { name: 'ファイルを選択' }),
    ).toBeInTheDocument();
    expect(screen.getByText('ここにファイルをドロップ')).toBeInTheDocument();
    const input = hiddenInput();
    expect(input).toHaveAttribute('type', 'file');
    expect(screen.getByText('添付ファイル')).toHaveAttribute('for', input.id);
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
      document.querySelector('[data-part="item-group"]'),
    ).not.toBeInTheDocument();
    expect(onFileReject).toHaveBeenCalledWith({
      files: [
        expect.objectContaining({ errors: ['TOO_MANY_FILES'] }),
        expect.objectContaining({ errors: ['TOO_MANY_FILES'] }),
        expect.objectContaining({ errors: ['TOO_MANY_FILES'] }),
      ],
    });
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
});
