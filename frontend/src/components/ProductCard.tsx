interface ProductCardProps {
  name: string;
  price: number | string;
  imageUrl?: string | null;
  description?: string;
  onOrder?: () => void;
}

export function ProductCard({ name, price, imageUrl, description, onOrder }: ProductCardProps) {
  const formattedPrice = Number(price).toFixed(2).replace('.', ',');

  return (
    <>
      <div className="md:hidden bg-white rounded-xl shadow border border-gray-100 overflow-hidden flex">
        <div className="w-24 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-4xl flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🎂</span>
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="font-bold text-pink-900 text-sm mb-1">{name}</div>
          {description && (
            <div className="text-xs text-gray-500 mb-2">{description}</div>
          )}
          <div className="flex justify-between items-center">
            <div className="text-pink-600 font-bold text-base">
              R$ {formattedPrice}
            </div>
            {onOrder && (
              <button
                onClick={onOrder}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:from-pink-700 hover:to-purple-700 transition-all"
              >
                Pedir
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
        <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center text-6xl lg:text-7xl">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl lg:text-7xl">🎂</span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-pink-900 mb-2">{name}</h3>
          {description && (
            <p className="text-gray-600 text-sm mb-4">{description}</p>
          )}
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-pink-600">
              R$ {formattedPrice}
            </div>
            {onOrder && (
              <button
                onClick={onOrder}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:from-pink-700 hover:to-purple-700 hover:shadow-lg transition-all"
              >
                Pedir
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}