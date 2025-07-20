package db_models

import (
	"time"
)

type User struct {
	ID        uint `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Admin     int    `gorm:"default:0"`
}
