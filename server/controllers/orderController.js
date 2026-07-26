import Order from '../models/Order.js';
import CropListing from '../models/Crop.js';
import Traceability from '../models/Traceability.js';

export const createOrder = async (req, res) => {
  try {
    const { items, payment, delivery } = req.body;
    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const crop = await CropListing.findOne({ listing_id: item.listing_id });
      if (!crop) {
        return res.status(404).json({ message: `Crop ${item.listing_id} not found` });
      }

      if (item.quantity_kg < 0.1 || item.quantity_kg > 1000) {
        return res.status(400).json({ message: `Invalid quantity for ${crop.crop_name}` });
      }

      if (item.quantity_kg > crop.available_kg) {
        return res.status(400).json({ message: `Insufficient quantity available for ${crop.crop_name}` });
      }

      crop.available_kg -= item.quantity_kg;
      await crop.save();

      const subtotal = item.quantity_kg * crop.price_per_kg;
      total_amount += subtotal;

      orderItems.push({
        crop: crop._id,
        listing_id: crop.listing_id,
        crop_name: crop.crop_name,
        farmer_name: crop.farmer_name,
        quantity_kg: item.quantity_kg,
        price_per_kg: crop.price_per_kg,
        subtotal
      });
    }

    const order = new Order({
      buyer: req.user._id,
      items: orderItems,
      total_amount,
      payment: {
        method: payment.method,
        status: payment.method === 'card' ? 'paid' : 'pending',
        transaction_id: payment.method === 'card' ? `TRX-${Date.now()}` : null,
      },
      delivery: {
        district: delivery.district,
        phone: delivery.phone,
        notes: delivery.notes || '',
      }
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmerOrders = async (req, res) => {
  try {
    const crops = await CropListing.find({
      $or: [{ farmer_name: req.user.name }, { farmer: req.user._id }]
    });
    
    const cropIds = crops.map((c) => c.listing_id);
    const orders = await Order.find({ 'items.listing_id': { $in: cropIds } })
      .sort({ createdAt: -1 })
      .populate('buyer', 'name email');
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyer', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderTraceability = async (req, res) => {
  try {
    const steps = await Traceability.find({ order_id: req.params.id }).sort({ order_index: 1 });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
