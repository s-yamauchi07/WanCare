import { RotatingTriangles } from "react-loader-spinner";

const PageLoading: React.FC = () => {
  return(
    <div className="flex flex-col items-center mt-20">
      <RotatingTriangles
        visible={true}
        height="120"
        width="120"
        colors={['#15A083', 'F3CF3E', '#DB5461']}
        ariaLabel="rotating-triangles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
      <h2 className="text-gray-800">Loading...</h2>
    </div>
  )
}
export default PageLoading;
