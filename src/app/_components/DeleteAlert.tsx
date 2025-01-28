" use client"

interface DeleteProps {
  onDelete: () => Promise<void>;
  onClose: () => void;
  deleteObj: string;
  isDeleting: boolean
}

const DeleteAlert: React.FC<DeleteProps> = ({ onDelete, onClose, deleteObj, isDeleting }) => {

  return(
    <>
      <div id="alert-additional-content-2" className="p-4 mb-4 text-red-800 border border-red-800 rounded-lg dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
        <div className="flex items-center">
          <span className="i-material-symbols-warning-outline w-6 h-6 mr-2"></span>
          <h3 className="text-lg font-bold">注意</h3>
        </div>
        <div className="mt-2 mb-4 text-sm">
          <p>一度{deleteObj}を削除すると、復旧できません。</p>
          <p>本当に削除しますか？</p>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-white bg-red-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
            onClick={onDelete}
            >
            {isDeleting ? "削除中" : "削除"}
          </button>
          <button 
            type="button"
            className="text-red-800 bg-transparent border border-red-800 hover:bg-red-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-xs px-3 py-1.5 text-center dark:hover:bg-red-600 dark:border-red-600 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800" data-dismiss-target="#alert-additional-content-2"
            aria-label="Close"
            onClick={onClose}
            >
            キャンセル
          </button>
        </div>
      </div>
    </>
  )
}

export default DeleteAlert;