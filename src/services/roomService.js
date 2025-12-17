const { Room, Hotel } = require('../models');
const { v4: uuid } = require('uuid');
const { listWithPagination } = require('./pagination');

function listRooms(options = {}) {
    // options can include: page, limit, where (e.g. { hotelId, isAvailable })
    return listWithPagination(Room, {
        ...options,
        include: [{ model: Hotel, attributes: ['id', 'name', 'address'] }]
    });
}

function getRoom(id) {
    return Room.findByPk(id, {
        include: [{ model: Hotel, attributes: ['id', 'name', 'address', 'starRating'] }]
    });
}

function getRoomsByHotel(hotelId, options = {}) {
    return listWithPagination(Room, {
        ...options,
        where: { ...options.where, hotelId }
    });
}

function createRoom(data) {
    return Room.create({ id: data.id || uuid(), ...data });
}

async function updateRoom(id, data) {
    const item = await Room.findByPk(id);
    if (!item) return null;
    await item.update(data);
    return item;
}

async function deleteRoom(id) {
    const item = await Room.findByPk(id);
    if (!item) return 0;
    await item.destroy();
    return 1;
}

module.exports = {
    listRooms,
    getRoom,
    getRoomsByHotel,
    createRoom,
    updateRoom,
    deleteRoom
};
