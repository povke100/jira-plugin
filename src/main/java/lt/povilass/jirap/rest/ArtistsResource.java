package lt.povilass.jirap.rest;


import com.atlassian.cache.Cache;
import lt.povilass.jirap.rest.dto.ArtistsDto;
import lt.povilass.jirap.service.ArtistsService;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;

/**
 * A resource of artists.
 */
@Path("/artists")
public class ArtistsResource {

    private static final Logger log = LoggerFactory.getLogger(ArtistsResource.class);

    private final ArtistsService artistsService;
    private final ObjectMapper objectMapper;
    private final Cache<String, ArtistsDto> cache;

    public ArtistsResource(ArtistsService artistsService, ObjectMapper objectMapper, Cache<String, ArtistsDto> cache) {
        this.artistsService = artistsService;
        this.objectMapper = objectMapper;
        this.cache = cache;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMessage(@QueryParam("search") String search) throws IOException {

        if (search == null || search.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        search = search.trim();

        ArtistsDto artistsDto;
        if (cache.containsKey(search)) {
            log.info("getMessage. Search key is found, returning result from cache.");
            artistsDto = cache.get(search);
        } else {
            artistsDto = artistsService.getArtists(search);
            cache.putIfAbsent(search, artistsDto);
        }

        return Response
                .ok(objectMapper.writeValueAsString(artistsDto))
                .build();
    }
}


