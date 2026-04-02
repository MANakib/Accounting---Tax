import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DuplicateWarningModal({ isOpen, onConfirm, onCancel }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Possible Duplicate Detected">
      <p className="text-sm text-gray-600 mb-6">
        A transaction with the same <strong>date</strong>, <strong>amount</strong>, and{' '}
        <strong>description</strong> already exists. Do you still want to save this transaction?
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Save Anyway
        </Button>
      </div>
    </Modal>
  );
}
