# Important Code Snippets

## 1. Advanced Data Aggregation and Analytics
```javascript
// From disease.controller.js
const analytics = await Disease.aggregate([
    {
        $group: {
            _id: "$name",
            count: { $sum: 1 }
        }
    },
    {
        $project: {
            name: "$_id",
            count: 1,
            percentage: {
                $round: [{ $multiply: [{ $divide: ["$count", totalDetections] }, 100] }, 1]
            }
        }
    },
    {
        $sort: { count: -1 }
    }
]);
```
This snippet demonstrates sophisticated MongoDB aggregation pipeline for disease analytics, calculating percentages and sorting results.

## 2. Secure Authentication Middleware
```javascript
// From auth.middleware.js
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) throw new ApiError(401, "Unauthorized request")
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) throw new ApiError(401, "Invalid Access Token")
        
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});
```
Shows robust JWT authentication implementation with proper error handling and security measures.

## 3. Advanced Product Search and Filtering
```javascript
// From product.controller.js
const { page = 1, limit = 10, search, category, sort, minPrice, maxPrice, minRating, featured } = req.query;
const filter = {};

if (category) filter.category = category;
if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
}
if (minRating) filter.rating = { $gte: Number(minRating) };
if (featured === 'true') filter.isFeatured = true;

if (search) {
    filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
    ];
}
```
Demonstrates complex product filtering with multiple criteria and search functionality.

## 4. Custom Error Handling
```javascript
// From ApiError.js
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.errors = errors
        this.message = message
        this.data = null

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
```
Shows a custom error handling implementation that extends the native Error class.

## 5. Secure Password Hashing
```javascript
// From user.model.js
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } catch (error) {
        console.log("Error while hashing password: ", error);
        next()
    }
});
```
Demonstrates secure password hashing using bcrypt with proper error handling.

## 6. Monthly Sales Analytics
```javascript
// From product.controller.js
const pipeline = [
    {
        $match: {
            createdAt: {
                $gte: startOfYear,
                $lte: endOfYear
            }
        }
    },
    {
        $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productData"
        }
    },
    {
        $unwind: "$productData"
    },
    {
        $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 },
            total: { $sum: "$productData.price" }
        }
    }
];
```
Shows complex MongoDB aggregation for monthly sales analytics with proper data transformation.

## 7. Async Handler Utility
```javascript
// From asyncHandler.js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}
```
Demonstrates a clean implementation of async error handling middleware.

## 8. Disease Prediction Integration
```javascript
// From disease.controller.js
export const predictDisease = asyncHandler(async (req, res) => {
    try {
        const image = req.body.image
        if (!image) throw new ApiError(400, "Image is required")

        const response = await axios.post(`${process.env.PYTHON_SERVICE_URL}/predict`, {
            image: image
        })

        return res.status(200).json(new ApiResponse(200, response.data, "Disease predicted successfully"))
    } catch (error) {
        throw new ApiError(500, "Something went wrong while predicting disease", error)
    }
});
```
Shows integration with external ML service for disease prediction with proper error handling. 






i want you to give important snippets for my document
i want to show case my work

create a separate file named "Snippets"
and paste those most important snippets there

do not include large pieces of code in this section.
●	Are especially critical to the operation of the system.
●	You feel might be of particular interest to the reader for some reason
●	Illustrate a nonstandard or innovative way of implementing an algorithm, data structure, etc.