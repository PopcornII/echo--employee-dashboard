import { Modal } from 'antd';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  title: string;
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
}

const ConfirmDeleteDialog: React.FC<ModalProps> = ({
  title,
  open,
  onOk,
  onCancel,
  okText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <Modal
      title={null} // Hides the default title of Ant Design's Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      className="rounded-lg shadow-lg"
      centered
    >
      <div className="flex flex-col items-center text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">
          Are you sure you want to delete? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteDialog;
