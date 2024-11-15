package com.travelbnb.payload;

public class FavouriteDto {
    private long id;
    private boolean status;
    private Long property;
    private Long user;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Long getProperty() {
        return property;
    }

    public void setProperty(Long property) {
        this.property = property;
    }

    public Long getUser() {
        return user;
    }

    public void setUser(Long user) {
        this.user = user;
    }
}
