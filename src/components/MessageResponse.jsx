
const MessageResponse = ({message , messageType}) => {
  return (
    <div
    className={`p-4 rounded text-center font-bold ${
      messageType === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}
    style={{
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      overflow: 'hidden',
      maxWidth: '100%', // Assuming you want it to be no wider than its parent container
      maxHeight: '100%' // Adjust accordingly if you want a specific max height
    }}
  >
    {message}
  </div>
  )
}

export default MessageResponse
